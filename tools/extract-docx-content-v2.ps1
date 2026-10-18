param(
  [string]$SourceDirectory = (Join-Path $PSScriptRoot '../docs'),
  [string]$OutputDirectory = (Join-Path $PSScriptRoot '../docs/source-extracts-v2')
)

# Read-only extraction of source OOXML. Paragraph IDs refer to all w:p nodes
# in document order, including empty paragraphs and table cells, not page numbers.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$sourceRoot = (Resolve-Path -LiteralPath $SourceDirectory).Path
$outputRoot = [System.IO.Path]::GetFullPath($OutputDirectory)
[void][System.IO.Directory]::CreateDirectory($outputRoot)
$wordNamespace = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
$catalog = @()
$files = @('GiaiDoan1930Den1935.docx', 'GiaiDoan1936Den1939.docx', 'GiaiDoan1939Den1945.docx')

function Read-ZipXml($Archive, [string]$EntryName) {
  $entry = $Archive.GetEntry($EntryName)
  if ($null -eq $entry) { return $null }
  $reader = [System.IO.StreamReader]::new($entry.Open())
  try { return [xml]$reader.ReadToEnd() } finally { $reader.Dispose() }
}

foreach ($name in $files) {
  $source = Join-Path $sourceRoot $name
  $zip = [System.IO.Compression.ZipFile]::OpenRead($source)
  try {
    $document = Read-ZipXml $zip 'word/document.xml'
    $ns = [System.Xml.XmlNamespaceManager]::new($document.NameTable)
    $ns.AddNamespace('w', $wordNamespace)
    $paragraphs = $document.SelectNodes('//w:body//w:p', $ns)
    $hash = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLowerInvariant()
    $lines = [System.Collections.Generic.List[string]]::new()
    $lines.Add('# Trích xuất nội dung ' + $name)
    $lines.Add('')
    $lines.Add('SHA256: `' + $hash + '`')
    $lines.Add('')
    $lines.Add('Pxxx là số thứ tự đoạn OOXML (kể cả đoạn trống, đoạn trong bảng); không phải số trang. Tệp gốc không được sửa. Đây là bản đọc nội dung, không kiểm định bố cục hoặc tính chính xác lịch sử.')
    $lines.Add('')
    $nonEmptyCount = 0
    for ($i = 0; $i -lt $paragraphs.Count; $i++) {
      $paragraph = $paragraphs[$i]
      $pieces = foreach ($node in $paragraph.SelectNodes('.//w:t | .//w:tab | .//w:br', $ns)) {
        if ($node.LocalName -eq 't') { $node.InnerText } else { ' ' }
      }
      $textValue = ($pieces -join '').Trim()
      if (-not $textValue) { continue }
      $nonEmptyCount++
      $anchor = 'P{0:D3}' -f ($i + 1)
      $lines.Add('## ' + $anchor)
      $lines.Add('')
      $lines.Add($textValue)
      $commentIds = @($paragraph.SelectNodes('.//w:commentRangeStart | .//w:commentReference', $ns) | ForEach-Object { $_.GetAttribute('id', $wordNamespace) } | Select-Object -Unique)
      if ($commentIds.Count) { $lines.Add(''); $lines.Add('Comment IDs: ' + ($commentIds -join ', ')) }
      $lines.Add('')
    }

    $comments = Read-ZipXml $zip 'word/comments.xml'
    $commentCount = 0
    if ($null -ne $comments) {
      $cns = [System.Xml.XmlNamespaceManager]::new($comments.NameTable)
      $cns.AddNamespace('w', $wordNamespace)
      $items = $comments.SelectNodes('//w:comment', $cns)
      $commentCount = $items.Count
      if ($commentCount -gt 0) {
        $lines.Add('# Ghi chú trong tài liệu gốc')
        $lines.Add('')
        foreach ($comment in $items) {
          $id = $comment.GetAttribute('id', $wordNamespace)
          $commentText = @($comment.SelectNodes('.//w:t', $cns) | ForEach-Object { $_.InnerText }) -join ' '
          $lines.Add('- C' + $id + ': ' + $commentText)
        }
      }
    }

    $outputName = [System.IO.Path]::GetFileNameWithoutExtension($name) + '.md'
    $extractPath = Join-Path $outputRoot $outputName
    [System.IO.File]::WriteAllText($extractPath, ($lines -join "`n") + "`n", [System.Text.UTF8Encoding]::new($false))
    $catalog += [pscustomobject]@{
      file = $name; sha256 = $hash; extract = $outputName
      extractSha256 = (Get-FileHash -LiteralPath $extractPath -Algorithm SHA256).Hash.ToLowerInvariant()
      paragraphs = $paragraphs.Count; nonEmptyParagraphs = $nonEmptyCount
      tables = $document.SelectNodes('//w:tbl', $ns).Count
      images = $document.SelectNodes('//w:drawing', $ns).Count
      insertions = $document.SelectNodes('//w:ins', $ns).Count
      deletions = $document.SelectNodes('//w:del', $ns).Count
      comments = $commentCount
    }
  } finally { $zip.Dispose() }
}
$catalogJson = ConvertTo-Json -InputObject @($catalog) -Depth 4
[System.IO.File]::WriteAllText((Join-Path $outputRoot 'catalog.json'), $catalogJson + "`n", [System.Text.UTF8Encoding]::new($false))
$catalog | Format-Table file, paragraphs, nonEmptyParagraphs, tables, comments

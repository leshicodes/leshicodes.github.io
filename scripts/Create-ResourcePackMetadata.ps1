$getZipFiles = $(Get-ChildItem -Path "docs\Minecraft\static" -Filter "*.zip"  -Recurse) | Where-Object { $_.Name -like "nutville-data-pack-*" }

foreach ($file in $getZipFiles) {
    $FileHash = $(Get-FileHash -Path $file.FullName -Algorithm SHA1)
}

#$FileHash = $(Get-FileHash -Path "docs\Minecraft\static\nutville-data-pack-server.zip" -Algorithm SHA1)
#$FileHash

$guid = New-Guid
#Write-Host $guid


Write-Host "resource-pack-id=$guid"
Write-Host "resource-pack-sha1=$($FileHash.Hash)"
$FileHash = $(Get-FileHash -Path "docs\Minecraft\static\nutville-data-pack-server.zip" -Algorithm SHA1)
#$FileHash

$guid = New-Guid
#Write-Host $guid


Write-Host "resource-pack-id=$guid"
Write-Host "resource-pack-sha1=$($FileHash.Hash)"
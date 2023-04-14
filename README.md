# EDCRYPT 

## nodejs cli tool to encrypt and decrypt images using xor operation

<table>
  <tbody>
  <tr>
    <td ><img src="https://user-images.githubusercontent.com/101383635/231770159-63818804-5be9-4d6b-b2e5-3ee6e6256eec.jpeg"/><br><b> Image </b></td>
        <td ><img alt="" src="https://user-images.githubusercontent.com/101383635/231770985-7b0becc3-676e-42a3-956e-669eb4037908.jpeg" width="130px;"><br><b> Encrypted image </b></td></td>
        <td ><img alt="" src="https://www.cleverfiles.com/howto/wp-content/uploads/2017/04/recover-deleted-key-300x300.png" width="130px;"><br><b> Key </b></td>
  </tr>
</tbody></table>

## Installation

```sh
npm i -g image-encrypt-decrypt
```

## Usage

```sh
edcrypt <command> [option]
```

### commands

```sh
help  #prints help info
```

### options

```sh
  -e, --encrypt              # The image to encrypt
  -d, --decrypt              # The image to decrypt
  -v, --version              # Print CLI version Default: false
  -k, --key                  # The key to use for decryption Default: false
  -i, --outputImageFileName  # The output image
  -p, --outputKeyFileName    # The output key
```

### For encrypting an image myImage.png to encryptedImage.png and saving the key to key.txt

```sh
edcrypt -e myImage.png -i encryptedImageName.png -p keyFile.txt
```

### For decrypting an image encryptedImage.png with its key key.txt to decryptedImage.png

```sh
edcrypt -d encryptedImage.png -k key.txt -i decryptedImage.png
```

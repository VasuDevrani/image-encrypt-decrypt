const alert = require('cli-alerts');
const fs = require('fs');
const jimp = require('jimp');
const path = require('path');

const decrypt = async flags => {
    if (flags.encrypt) {
		alert({
			type: `warning`,
			name: `Invalid combination of flags`,
			msg: `Cannot use both --encrypt and --decrypt flags together`
		});
		process.exit(1);
	}

    const filePath = flags.decrypt;
    if (!filePath) {
		alert({
			type: `warning`,
			name: `Invalid file path`,
			msg: `Please provide a valid file path`
		});
		process.exit(1);
	}

    if (!fs.existsSync(filePath)) {
		alert({
			type: `warning`,
			name: `Invalid file path`,
			msg: `Please provide a valid file path`
		});
		process.exit(1);
	}

    if (!flags.key) {
		alert({
			type: `warning`,
			name: `Invalid key`,
			msg: `Please provide a valid key with --key/-k`
		});
		process.exit(1);
	}

    try{
        console.log("\n⌛ Reading image...\n");

        const image = await jimp.read(filePath);
        const extension = image.getExtension();

        const rgba = image.bitmap.data;
        const length = rgba.length;

        console.log("\n✅ Image read successfully\n");
        const keyPath = flags.key;

        if (!fs.existsSync(keyPath)) {
			alert({
				type: `error`,
				name: `Invalid key path`,
				msg: `Please provide a valid key path with --key/-k`
			});
			process.exit(1);
		}

        const key = fs.readFileSync(keyPath, 'utf8');

        const keyArray = Array.from(Buffer.from(key, 'base64'));
        if (keyArray.length !== length) {
			alert({
				type: `error`,
				name: `Invalid key`,
				msg: `The key is not valid`
			});

			process.exit(1);
		}

        console.log("\n✅ Key read successfully\n");

        for (let i = 0; i < length; i++) {
			const k = keyArray[i];
			rgba[i] = rgba[i] ^ k;
		}
        image.bitmap.data = rgba;

        console.log("\n⌛ decryption success, saving image...\n")

        const fileName = path
			.basename(filePath)
			.replace(/\_encrypted$/, '');

		let fileNameWithoutExtension = `${fileName.split('.')[0]}_decrypted`;

		if (flags.outputImageFileName) {
			fileNameWithoutExtension = flags.outputImageFileName.split('.')[0];
		}

        if (fs.existsSync(`${fileNameWithoutExtension}.${extension}`)) {
			console.log(flags);
			alert({
				type: `error`,
				name: `Output image file already exists: ${fileNameWithoutExtension}.${extension}`,
				msg: `Please provide a different file name with --outputImageFileName/-i flag`
			});
			process.exit(1);
		}

        image.write(`${fileNameWithoutExtension}.${extension}`);

        alert({
			type: `success`,
			name: `Success`,
			msg: `✅ Image decrypted and saved successfully\n
			Decrypted Image: ${fileNameWithoutExtension}.${extension}`
		});
    }catch(err){
        alert({
			type: `error`,
			name: `Error`,
			msg: `${err}`
		});
    }
}

module.exports = decrypt;
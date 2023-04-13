const alert = require('cli-alerts');
const fs = require('fs');
const jimp = require('jimp');
const path = require('path');

const encrypt = async flags => {
    if (flags.decrypt) {
		alert({
			type: `warning`,
			name: `Invalid combination of flags`,
			msg: `Cannot use both --encrypt and --decrypt flags together`
		});
		process.exit(1);
	}

    const filePath = flags.encrypt;
    if (!filePath) {
		alert({
			type: `warning`,
			name: `Invalid file path`,
			msg: `Please provide a valid file path`
		});
		process.exit(1);
	}

    const cwd = process.cwd();
    const fullPath = path.join(cwd, filePath);
    if (!fs.existsSync(fullPath)) {
		alert({
			type: `warning`,
			name: `Invalid file path`,
			msg: `Please provide a valid file path`
		});
		process.exit(1);
	}

    try{
        const fileName = path.basename(fullPath);
        const fileNameWithoutExtension = fileName.split('.')[0];

        const image = await jimp.read(fullPath);
        const extension = image.getExtension();

        console.log("\n✅ Image read successfully\n");

        let outputImageFile = `${fileNameWithoutExtension}_encrypted.${extension}`;

        if (flags.outputImageFileName) {
			outputImageFile = path.basename(flags.outputImageFileName);

			if (!outputImageFile.includes('.')) {
				outputImageFile = `${outputImageFile}.${extension}`;
			} else {
				outputImageFile =
					outputImageFile.split('.')[0] + `.${extension}`;
			}
		}

        if (fs.existsSync(outputImageFile)) {
			alert({
				type: `error`,
				name: `Invalid output image file name`,
				msg: `The output image file name already exists: ${outputImageFile}
				\nPlease provide a different output image file name with --outputImageFileName/-i flag`
			});
			process.exit(1);
		}

        let outputKeyFile = `${fileNameWithoutExtension}_key.txt`;
        if (flags.outputKeyFileName) {
			outputKeyFile = path.basename(flags.outputKeyFileName);
		}

        if (fs.existsSync(outputKeyFile)) {
			alert({
				type: `error`,
				name: `Invalid output key file name`,
				msg: `The output key file name already exists: ${outputKeyFile}
				\nPlease provide a different output key file name with --outputKeyFileName/-p flag`
			});
			process.exit(1);
		}

        console.log("⌛ Encrypting image...\n")

        const rgba = image.bitmap.data;
        const length = rgba.length;
        const key = [];
		for (let i = 0; i < length; i++) {
			key.push(Math.floor(Math.random() * 256));
		}

        for (let i = 0; i < length; i++) {
            const k = key[i];
            rgba[i] = rgba[i] ^ k;
        }

        image.bitmap.data = rgba;
		image.write(outputImageFile);

        console.log("⌛ image encrypted, saving image...\n")
        fs.writeFileSync(outputKeyFile, Buffer.from(key).toString('base64'));

        alert({
			type: `success`,
			name: `Image encrypted successfully`,
			msg: `✅ Image encrypted successfully:\n
			Encrypted Image: ${outputImageFile}\n
			Key: ${outputKeyFile}`
		});
    }catch(err){
        alert({
			type: `error`,
			name: `Error`,
			msg: `${err || 'Unknown error'}`
		});
		process.exit(1);
    }
}

module.exports = encrypt;
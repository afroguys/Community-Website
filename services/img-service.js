const fs = require('fs');
const path = require('path');

class ImgService {
    async storeImg(imgStr, folderPath) {
        try {
            const matches = imgStr.match(/^data:image\/([A-Za-z]+);base64,(.+)$/);
            if (!matches) {
                return { next: false, message: 'Invalid image format' };
            }
            const ext = matches[1];
            const data = Buffer.from(matches[2], 'base64');
            const dir = path.join(__dirname, '../storage', folderPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            const filename = `profile_${Date.now()}.${ext}`;
            const filepath = path.join(dir, filename);
            fs.writeFileSync(filepath, data);
            return `/storage/${folderPath}/${filename}`;
        } catch (err) {
            console.log(err);
            return { next: false, message: 'image not uploaded !' };
        }
    }

    async removeFolder(imgFolder) {
        const dir = path.join(__dirname, '../../storage', imgFolder);
        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    }

    async deleteImg(imgPath, number = -3) {
        const filepath = path.join(__dirname, '../../storage', imgPath.replace('/storage/', ''));
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    }
}

module.exports = new ImgService();

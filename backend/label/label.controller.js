const multer = require('multer');

const LabelSetting = require("./label.model");

async function newLable(req, res) {
    const user_id = "67237ee56a42044404423c8e";

    const newLabelSetting = new LabelSetting({
        user: user_id,
        labelDetails: {
            hideGstNumber: false,
            hidePickupPhoneNumber: false,
            hideRtoPhoneNumber: false,
            hidePickupContactName: false,
            hideRtoContactName: false,
        },
        productDetails: {
            hideSKU: false,
            hideProduct: false,
            hideQTY: false,
            hideTotalAmount: false,
            hideDiscountAmount: false,
            showGst: false,
            trimSkuUpto: null,
            trimProductNameUpto: null,
        }
    });

    try {
        const savedLabelSetting = await newLabelSetting.save();
        res.status(201).json({
            success: true,
            message: 'Label setting created',
            data: savedLabelSetting,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}


// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images allowed'));
        }
    }
});

async function setting(req, res) {
    const user_id = "67237ee56a42044404423c8e";

    const updateData = req.body;

    if (req.file) {
        updateData.image = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    }

    try {
        const updatedLabelSetting = await LabelSetting.findOneAndUpdate(
            { user: user_id },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        console.log(updatedLabelSetting);

        if (!updatedLabelSetting) {
            return res.status(404).json({ message: 'Label setting not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Label setting updated',
            data: updatedLabelSetting,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    setting,
    newLable,
}
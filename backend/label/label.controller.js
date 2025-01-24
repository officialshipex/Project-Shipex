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

<<<<<<< HEAD
=======
async function labelData(req,res){
    const user_id = "67237ee56a42044404423c8e";
    try{
        const getData=await LabelSetting.findOne(
            {user:user_id}  
        )
        res.status(200).json({
            success: true,
            message: 'Label setting fetched',
            data: getData,
        });
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

>>>>>>> 2f5fb255d19459b4d181857acf2a4bda5760fa09
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

<<<<<<< HEAD
        console.log(updatedLabelSetting);
=======
        // console.log(updatedLabelSetting);
>>>>>>> 2f5fb255d19459b4d181857acf2a4bda5760fa09

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
<<<<<<< HEAD
=======
    labelData
>>>>>>> 2f5fb255d19459b4d181857acf2a4bda5760fa09
}
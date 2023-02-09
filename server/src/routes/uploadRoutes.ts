import express from 'express'
import multer from 'multer'
import path from 'path'

const router = express.Router()

const storage = multer.diskStorage({
  destination(_, __, cb) {
    cb(null, 'client/public/images')
  },
  filename(_, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

const checkFileType = (
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const fileTypes = /jpg|jpeg|png/
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = fileTypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb(new Error('Images only'))
  }
}

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    checkFileType(file, cb)
  },
})

router.post('/', upload.single('image'), (req, res) => {
  res.send(`\\${req.file.path.replace('client\\public\\', '')}`)
})

export default router

export default async (req, res) => {
  if (!req.files) return res.status(404)

  res.send({ files: req.files.map(file => file.filename) })
}

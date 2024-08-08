const validation = (schema) => {
  return (req, res, next) => {
    
    const dataToValidate = {
      ...req.body,
      ...req.params,
      ...req.query,
      ...(req.file ? { file: req.file } : {}), // For single file upload
      ...(req.files ? { ... req.files } : {}), // For multiple files upload
    };


    // Validate against the schema
    const { error } = schema.validate(dataToValidate, { abortEarly: false });

    if (error) {
      const errMessage = error.details.map((err) => err.message);
      return res.status(409).json({ errors: errMessage });
    }

    next();
  };
};

export default validation;

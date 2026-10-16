export function validate(schema) {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (err) {
            res.status(400).json({
                error: err.issues.map((issue) => issue.message).join(', '),
            });
        }
    };
}

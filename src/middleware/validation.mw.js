export function validate(schema) {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (err) {
            const errors = err.issues.map((issue) => {
                const field = issue.path.length ? issue.path.join('.') : 'body';

                return `${field}: ${issue.message}`;
            });

            res.status(400).json({
                error: errors.join(', '),
            });
        }
    };
}

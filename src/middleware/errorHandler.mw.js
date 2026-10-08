export const errorHandler = (err, req, res) => {
    if (res.headersSent) {
        return;
    }
    res.status(err?.status ?? 500).send({
        message: err?.message ?? `Internal server error`,
    });
};

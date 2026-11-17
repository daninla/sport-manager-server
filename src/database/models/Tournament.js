export default (sequelize, DataTypes) => {
    const Tournament = sequelize.define(
        'Tournament',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            startsAt: {
                type: DataTypes.DATE,
                field: 'starts_at',
            },
            location: {
                type: DataTypes.TEXT,
            },
            tablesCount: {
                type: DataTypes.SMALLINT,
                allowNull: false,
                field: 'tables_count',
            },
            competitionType: {
                type: DataTypes.TEXT,
                field: 'competition_type',
            },
            bracketFormat: {
                type: DataTypes.TEXT,
                field: 'bracket_format',
            },
            bestOf: {
                type: DataTypes.SMALLINT,
                allowNull: false,
                field: 'best_of',
            },
            maxParticipants: {
                type: DataTypes.INTEGER,
                field: 'max_participants',
            },
            isRated: {
                type: DataTypes.BOOLEAN,
                field: 'is_rated',
            },
            ratingCoefficient: {
                type: DataTypes.DECIMAL(3, 2),
                field: 'rating_coefficient',
            },
            ageCategory: {
                type: DataTypes.TEXT,
                field: 'age_category',
            },
            ratingLimit: {
                type: DataTypes.INTEGER,
                field: 'rating_limit',
            },
            gender: {
                type: DataTypes.TEXT,
            },
            pointsPerGame: {
                type: DataTypes.SMALLINT,
                field: 'points_per_game',
                defaultValue: 11,
            },
            status: {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue: 'Upcoming',
            },
        },
        {
            tableName: 'tournaments',
            timestamps: false,
        },
    );

    return Tournament;
};

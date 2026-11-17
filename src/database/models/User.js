export default (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.TEXT,
                unique: true,
                allowNull: false,
            },
            password_hash: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            firstName: {
                type: DataTypes.TEXT,
                allowNull: false,
                field: 'first_name',
            },
            lastName: {
                type: DataTypes.TEXT,
                allowNull: false,
                field: 'last_name',
            },
            sex: {
                type: DataTypes.TEXT,
            },
            birthDate: {
                type: DataTypes.DATE,
                field: 'birth_date',
            },
            city: {
                type: DataTypes.TEXT,
            },
            club: {
                type: DataTypes.TEXT,
            },
            notes: {
                type: DataTypes.TEXT,
            },
        },
        {
            tableName: 'users',
            timestamps: false,
        },
    );

    User.associate = ({ UserRole }) => {
        User.hasMany(UserRole, {
            foreignKey: 'userId',
        });
    };

    return User;
};

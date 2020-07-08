const { Integer, Text, Select, Relationship, Url, DateTime } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { admin, moderator, allowRoles } = require('../../helpers/readrAccess');

module.exports = {
    fields: {
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true
        },
        title: {
            label: '標題',
            type: Text,
            isRequired: true
        },
        /*choice: {
            label: '精選文章',
            type: Relationship,
            ref: 'Post'
        },*/
        link: {
            label: '連結',
            type: Url,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled, archived, invisible',
            defaultValue: 'draft'
        },
        description: {
            label: '描述',
            type: Text,
        },
        heroImage: {
            label: '首圖',
            type: Relationship,
            ref: 'Image'
        },
        publishTime: {
            label: '發佈時間',
            type: DateTime,
            format: 'MM/dd/yyyy HH:mm',
            defaultValue: new Date().toISOString(),
            /*dependsOn: {
                '$or': {
                    state: [
                        'published',
                        'scheduled'
                    ]
                }
            }*/
        },
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        update: allowRoles(admin, moderator),
        create: allowRoles(admin, moderator),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'choice, state, createdAt',
        defaultSort: '-createdAt',
    },
}
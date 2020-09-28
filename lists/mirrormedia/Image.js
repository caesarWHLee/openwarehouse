const { Text, Select, Relationship, File, Url, Checkbox } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { ImageAdapter } = require('../../lib/ImageAdapter');
// const access = require('../../helpers/access');
const { addWatermark } = require('../../helpers/watermark.js')
const fs = require('fs')
const { admin, moderator, editor, allowRoles } = require('../../helpers/mirrormediaAccess');
const gcsDir = 'assets/images/'

module.exports = {
    fields: {
        title: {
            label: '標題',
            type: Text,
            isRequired: true
        },
        file: {
            label: '檔案',
            type: File,
            // adapter: new ImageAdapter(gcsDir),
            adapter: new ImageAdapter(gcsDir),
            isRequired: true,

        },
        copyright: {
            label: '版權',
            type: Select,
            dataType: 'string',
            options: 'Creative-Commons, Copyrighted',
            defaultValue: 'Copyrighted'
        },
        topic: {
            label: '專題',
            type: Relationship,
            ref: 'Topic'
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag',
            many: true
        },
        needWatermark:{
            label: 'Need watermark?',
            type: Checkbox
        },
        keywords: {
            label: '關鍵字',
            type: Text
        },
        meta: {
            label: '中繼資料',
            type: Text
        },
        urlOriginal: {
            type: Url,
            access: {
                create: false,
                update: false,
            }
        },
        urlDesktopSized: {
            type: Url,
            access: {
                create: false,
                update: false,
            }
        },
        urlMobileSized: {
            type: Url,
            access: {
                create: false,
                update: false,
            }
        },
        urlTabletSized: {
            type: Url,
            access: {
                create: false,
                update: false,
            }
        },
        urlTinySized: {
            type: Url,
            access: {
                create: false,
                update: false,
            }
        },
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        update: allowRoles(admin, moderator, editor),
        create: allowRoles(admin, moderator, editor),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'title, image, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        beforeChange: async ({ existingItem, resolvedData}) => {
            console.log("BEFORE CHANGE")
            console.log("EXISTING ITEM", existingItem)
            console.log("RESOLVED DATA", resolvedData)

			var origFilename = ''
            if (typeof resolvedData.file != 'undefined'){
                var stream = fs.createReadStream(`./images/${resolvedData.file.id}-${resolvedData.file.originalFilename}`)
                var id = resolvedData.file.id
				origFilename = resolvedData.file.originalFilename
                if (resolvedData.needWatermark) {
                    stream = await addWatermark(stream, resolvedData.file.id, resolvedData.file.originalFilename)
                }

            } else if (typeof existingItem.file != 'undefined'){

                var stream = fs.createReadStream(`./images/${existingItem.file.id}-${existingItem.file.originalFilename}`)
                var id = existingItem.file.id
				origFilename = existingItem.file.originalFilename
                if (existingItem.needWatermark) {
                    stream = await addWatermark(stream, existingItem.file.id, existingItem.file.originalFilename)
                }
            }

            const image_adapter = new ImageAdapter(gcsDir)

            let _meta = image_adapter.sync_save(stream, id)
            if (resolvedData.file) {
                resolvedData.urlOriginal = _meta.url.urlOriginal
                resolvedData.urlDesktopSized = _meta.url.urlDesktopSized
                resolvedData.urlMobileSized = _meta.url.urlMobileSized
                resolvedData.urlTabletSized = _meta.url.urlTabletSized
                resolvedData.urlTinySized = _meta.url.urlTinySized
            } 

            return {existingItem, resolvedData}
        }
    },
    labelField: 'title',
}

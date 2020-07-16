const { Text, Select, Relationship, File, Url, Checkbox } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { ImageAdapter } = require('../../lib/ImageAdapter');
const access = require('../../helpers/access');
const gcsDir = 'assets/images/'
const { LocalFileAdapter } = require('@keystonejs/file-adapters');
const { addWatermark } = require('../../lib/watermark.js')
const fs = require('fs')

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
            adapter: new LocalFileAdapter({src:'./images',path:'/images', //function({id, }){}
            }),
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
        update: access.userIsAboveAuthorOrOwner,
        create: access.userIsNotContributor,
        delete: access.userIsAboveAuthorOrOwner,
    },
    adminConfig: {
        defaultColumns: 'title, image, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        // Hooks for create and update operations
        // resolveInput: ({ operation, existingItem, resolvedData, context }) => {
        //     console.log("RESOLVE INPUT")
        //
        //     return resolvedData
        // },
        beforeChange: async ({operation, existingItem, originalInput, resolvedData, context}) => {
            console.log("BEFORE CHANGE")
            console.log("EXISTING ITEM", existingItem)
            console.log("RESOLVED DATA", resolvedData)

            let stream = fs.createReadStream(`./images/${resolvedData.file.id}-${resolvedData.file.originalFilename}`)

            if (resolvedData.needWatermark) {
                stream = await addWatermark(stream, resolvedData.file.id)
            }
            const image_adapter = new ImageAdapter(gcsDir)

            // {id, filename, _meta} = await image_adapter.save({stream, filename, mimetype, encoding, id})
            let _meta = image_adapter.sync_save(stream, resolvedData.file.id)
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

const crypto = require('crypto')
const randomString = () => crypto.randomBytes(6).hexSlice()

module.exports = (project) => async (keystone) => {
    // Count existing users
    // However, this query don't have access (TODO)
    const context = keystone.createContext({ skipAccessControl: true })

    const {
        data: {
            _allUsersMeta: { count },
        },
    } = await context.executeGraphQL({
        query: `query {
            _allUsersMeta {
                count
            }
        }`,
    })

    if (count === 0) {
        const projectAdminRole =
            project === 'mirrormedia' ? 'role: "moderator", isAdmin: true' : 'role: "admin"'
        const email = 'admin@mirrormedia.mg'
        const password = 'mirrormedia'
        // const password = (process.env.NODE_ENV === 'development') ? 'mirrormedia' : randomString();
        console.log('------ready to create new admin user------')

        const response = await context.executeGraphQL({
            query: `mutation initialUser($password: String, $email: String) {
                createUser(data: {name: "admin", email: $email, password: $password, ${projectAdminRole}}) {
                id
                }
            }`,
            variables: {
                password,
                email,
            },
        })

        console.log(response)

        console.log(`
            User created:
            email: ${email}
            password: ${password}
            Please change these details after initial login.
        `)
    }
}

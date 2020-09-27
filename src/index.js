import 'cross-fetch/polyfill'
import ApolloClient, { gql } from 'apollo-boost';
import dotenv from 'dotenv'

dotenv.config()
const client = new ApolloClient({
    uri: 'https://api.github.com/graphql',
    request: operation => {
        operation.setContext({
            headers: {
                authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`
            }
        })
    }
})

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
    query ($organization: String!){
        organization(login: $organization){
            name
            url
            repositories(first: 5) {
                stargazers {
                    totalCount
                }
                edges {
                    node {
                        name
                        url
                    }
                }
            }
        }
    }
`;

console.log(process.env.GITHUB_PERSONAL_ACCESS_TOKEN)
client
    .query({
        query: GET_REPOSITORIES_OF_ORGANIZATION,
        variables: {
            organization: 'VolaTrade'
        }
    })
    .then(({data}) => data.organization.repositories.edges)
    .then(repositories => repositories.map(x => x.node.name))
    .then(names => names.forEach(console.log))
    .catch(err => console.log(err.message))
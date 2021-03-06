const fs = require('fs')
const drafter = require('drafter')
const urlParser = require('./url')
// const parseParameters = require('./parameters')
let allRoutesList = []

module.exports = (async function () {
    let result = await new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../../../upload/test.md`, 'utf-8', (err, content) => {
            if (err) {
                return reject(err)
            }
            resolve(content)
        })
    })

    let str = await drafter.parse(result, { type: 'ast' }, (err, result) => {
        if (err) return err
        return result
    })

    str.ast.resourceGroups.forEach(resourceGroup => {
        resourceGroup.resources.forEach(setupResourceAndUrl)
    })

    function setupResourceAndUrl(resource) {
        var parsedUrl = urlParser.parse(resource.uriTemplate)
        // var key = parsedUrl.url
        // routeMap[key] = routeMap[key] || { urlExpression: key, methods: {} }
        // parseParameters(parsedUrl, resource.parameters, routeMap)
        resource.actions.forEach(function (action) {
            // parseAction(parsedUrl, action, routeMap)
            saveRouteToTheList(parsedUrl, action)
        })
    }
    function saveRouteToTheList(parsedUrl, action) {
        // used to add options routes later
        // if (typeof allRoutesList[parsedUrl.url] === 'undefined') {
        //     allRoutesList[parsedUrl.url] = []
        // }
        action.url = parsedUrl.url
        allRoutesList.push(action)
    }

    return allRoutesList
})()

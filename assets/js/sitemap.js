$(document).ready(async function () {
    const index = await $.get('/sitemap.xml', null, null, 'xml')
    const children = await Promise.all(Array.from(index.getElementsByTagName('loc'), function (loc) {
        return $.get(new URL(loc.textContent).pathname, null, null, 'xml')
    }))
    const list = document.createDocumentFragment()
    for (const child of children) {
        for (const loc of child.getElementsByTagName('loc')) {
            const link = document.createElement('a')
            link.href = loc.textContent
            link.textContent = link.pathname
            const item = document.createElement('li')
            item.appendChild(link)
            list.appendChild(item)
        }
    }
    document.getElementById('sitemap').appendChild(list)
})

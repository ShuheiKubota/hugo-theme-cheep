function replaceSince(spanElem) {
    var v = spanElem.firstChild.data
    var mod = new Date(v)

    var s = since(new Date(Date.now()), new Date(v))
    console.log(s)

    var expr = "now"
    if (s.years) {
        expr = s.years + " years ago"
    } else if (s.months) {
        expr = s.months + " months ago"
    } else if (s.days) {
        expr = s.days + " days ago"
    } else if (s.hours) {
        expr = s.hours + " hours ago"
    } else if (s.minutes) {
        expr = s.minutes + " minutes ago"
    }

    spanElem.title = v
    spanElem.firstChild.data = expr
}

// 2 year, 35 months
// 11 months, 360 days
// 27 days
// 23 hours 59 minuts
function since(now, dt) {
    var s = null
    var d = now.getTime() - dt.getTime()

    var dym = (now.getFullYear() * 12 + now.getMonth() + 1) - (dt.getFullYear() * 12 + dt.getMonth() + 1);
    if (dym >= 12)  {
        s = {...(s||{}), years: Math.trunc(dym / 12)}
    }
    if (dym > 0) {
        s = {...(s||{}), months: dym}
    }
    if (s === null || s.years === undefined) {
        var days = Math.floor(d / (24 * 60 * 60 * 1000))
        if (days > 0) {
            s = {...(s||{}), days: Math.floor(d / (24 * 60 * 60 * 1000))}
        }
    }
    if (s !== null) {
        return s
    }

    d %= 24 * 60 * 60 * 1000
    console.log('d', d)

    if (d >= 60 * 60 * 1000) {
        s = {...(s||{}), hours: Math.floor(d / (60 * 60 * 1000))}
        d %= 60 * 60 * 1000
    }
    if (d >= 60 * 1000) {
        //return {minutes: Math.floor(d / (60 * 1000))}
        s = {...(s||{}), minutes: Math.floor(d / (60 * 1000))}
    }

    return s || {}
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.highlight').forEach((e) => {
        var text = ''
        e.querySelectorAll('span.line').forEach((line) => text += line.textContent)
        //console.log(text)

        let btn = document.createElement('a')
        btn.append('copy')
        btn.setAttribute('class', 'copy')
        btn.addEventListener('click', (be) => navigator.clipboard.writeText(text))
        e.appendChild(btn)
    })

    document.querySelectorAll('.may_be_outdated').forEach((e) => {
        var mod = new Date(e.getAttribute('cheep-since'))
        var limitStr = e.getAttribute('cheep-limit')
        var limit = 0
        try {
            limit = parseInt(limitStr)
        } catch (e) {
            console.log(e)
            return
        }
        var limitUnit = e.getAttribute('cheep-limit-unit')

        if ((limit === null) || (limitUnit === null)) {
            return
        }

        var s = since(new Date(Date.now()), mod)

        var over = ''
        if (limitUnit === 'year' && s.years !== undefined && limit < s.years) {
            over = s.years + '年'
        } else if (limitUnit === 'month' && s.months !== undefined && limit < s.months) {
            over = s.months + 'ヵ月'
        }
        if (over !== '') {
            e.innerHTML = '最終更新日から ' + over + ' 以上が経過しています。<br/>内容が古くなっている可能性があるのでご注意ください。'
        }

        console.log('debug' , 'data', e.innerHTML)
    })
})

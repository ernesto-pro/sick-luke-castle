/**
 * Apex → www redirect.
 * The zone serves the site on www.sickluke.com; sickluke.com answers with a
 * single 301 so there is one canonical host and one indexed copy.
 */
export default {
  fetch(request) {
    const url = new URL(request.url)
    url.hostname = 'www.sickluke.com'
    return Response.redirect(url.toString(), 301)
  },
}

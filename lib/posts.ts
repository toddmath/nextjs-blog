import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"

const postsDirectory = path.join(process.cwd(), "posts")

// interface MatterPostData {
//   date: string
//   title: string
// }
// export interface PostData extends MatterPostData {
//   id: string
// }

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory)

  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, "")
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const matterResult = matter(fileContents)

    return {
      id,
      ...(matterResult.data as { date: string; title: string }),
    }
  })

  return allPostsData.sort(({ date: a }, { date: b }) =>
    a < b ? 1 : a > b ? -1 : 0
  )
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)

  return fileNames.map(fileName => ({
    params: {
      id: fileName.replace(/\.md$/, ""),
    },
  }))
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  const matterResult = matter(fileContents)
  const processedContent = await remark().use(html).process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string }),
  }
}

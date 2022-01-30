import path from "path";
import fs from "fs/promises";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";
import { marked } from "marked";


export type Post = {
    slug: string;
    title: string;
};

export type PostMarkdownAttributes = {
    title: string;
};

const postsPath = path.join(__dirname, "..", "posts");

function isValidPostAttributes(
    attributes: any
): attributes is PostMarkdownAttributes {
    return attributes?.title;
}

export async function getPost(slug: string) {
    const postFilePath = path.join(postsPath, `${slug}.md`);
    const postFile = await fs.readFile(postFilePath)
    const {attributes, body} = parseFrontMatter(postFile.toString())
    invariant(
        isValidPostAttributes(attributes),
        `Post ${postFilePath} is missing attributes`
    );
    const html = marked(body);
    return {
        slug,
        title: attributes.title,
        html
    }

}
export async function getPosts() {
    const dir = await fs.readdir(postsPath);
    return Promise.all(
        dir.map(async filename => {
            const file = await fs.readFile(
                path.join(postsPath, filename)
            );
            console.log(file)
            const { attributes } = parseFrontMatter(
                file.toString()
            );
            invariant(
                isValidPostAttributes(attributes),
                `${filename} has bad meta data!`
            );
            return {
                slug: filename.replace(/\.md$/, ""),
                title: attributes.title
            };
        })
    );
}

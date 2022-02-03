import {useActionData, Form, redirect} from "remix";
import {createPost} from "~/post";
import type {ActionFunction} from "remix";


export const action: ActionFunction = async ({
                                                 request
                                             }) => {
    const formData = await request.formData();

    const title = formData.get("title");
    const slug = formData.get("slug");
    const markdown = formData.get("markdown");

    const errors = {};
    if (!title) errors.title = true;
    if (!slug) errors.slug = true;
    if (!markdown) errors.markdown = true;

    if (Object.keys(errors).length) {
        return errors;
    }


    await createPost({title, slug, markdown});

    return redirect("/admin");
};

export default function NewPost() {
    const errors = useActionData();

    return (
        <Form method="post">
            <p>
                <label>
                    Post Title:{" "}
                    {errors?.title ? (
                        <em>Title is required</em>
                    ) : null}
                    <input type="text" name="title" />
                </label>
            </p>
            <p>
                <label>
                    Post Slug:{" "}
                    {errors?.slug ? <em>Slug is required</em> : null}
                    <input type="text" name="slug" />
                </label>
            </p>
            <p>
                <label htmlFor="markdown">Markdown:</label>{" "}
                {errors?.markdown ? (
                    <em>Markdown is required</em>
                ) : null}
                <br />
                <textarea rows={20} name="markdown" />
            </p>
            <p>
                <button type="submit">Create Post</button>
            </p>
        </Form>
    );
}

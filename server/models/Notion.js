const { Client } = require("@notionhq/client")
const { listBlockChildren } = require("@notionhq/client/build/src/api-endpoints")

class Notion{
    constructor(integration_key, database_id=null){
        this.notion = new Client({ auth: integration_key })
        this.dbId = database_id
    }

    readPropertyContent = (property, type) => {
        switch (type) {
            case "title":
                return property.title.length > 0 ? property.title[0].plain_text : ""
            case "text":
                return property.rich_text.length > 0 ? property.rich_text[0].plain_text : ""
            case "multi-select":
                return property.multi_select.map( item => item.name)
            case "select":
                return property.select.name
            case "url":
                return property.url
            case "date-start":
                return property.date.start
            case "date-end":
                return property.date.end
            case "checkbox":
                //console.log(property)
                return property.checkbox
                break;
            default:
                throw Error("error getting data")
                break;
        }
    }

    readBlockContent = (block) => {
        const { type } = block;
        if (type === "code"){
            console.log(block)
            const { language } = block[type];
            return {
                type,
                content: block[type].text.map( textBlock => {
                    const { plain_text, annotations } = textBlock
                    annotations.language = language
                    return {
                        plain_text,
                        annotations
                    }
                })
            }
        }
        if (type !== "image"){
            return {
                type,
                content: block[type].text.map( textBlock => {
                    const { plain_text, annotations } = textBlock;
                    return {
                        plain_text,
                        annotations
                    }
                })
            }
        }else{
            const { url } = block[type].file;
            const caption = block[type].caption.length > 0 ? block[type].caption[0].plain_text : ""
            return {
                type,
                content: [{
                    url,
                    caption
                }]
            }
        }
        
    }

    


    getBlogPostInfo = async ({ isBlog=false, isProject=false, id=undefined}) => {
        const { notion, dbId } = this;

        

        const or = []

        
        // Filters
        if (isProject){
            or.push({
                property: "isProject",
                checkbox: {
                    "equals": true
                }
            })
        }

        if (isBlog){
            or.push({
                property: "isBlog",
                checkbox: {
                    "equals": true
                }
            })
        }

        // Creating object to be return for each result
        const parseBlogPostResponse = (resp) => {
            // Parses projects results list from Notion API
            const result = resp.map( (page, idx) => {
                const { Name, Timeline, Type, Languages, GitHub, External, Description, Frameworks, Published, isBlog, isProject } = page.properties;
                this.readPropertyContent(isBlog, "checkbox")
                return {
                    id: page.id,
                    lastEdited: page.last_edited_time,
                    name: this.readPropertyContent(Name, "title"),
                    timeline: this.readPropertyContent(Timeline, "text"),
                    type: this.readPropertyContent(Type, "multi-select"),
                    languages: this.readPropertyContent(Languages, "multi-select"),
                    frameworks: this.readPropertyContent(Frameworks, "multi-select"),
                    github: this.readPropertyContent(GitHub, "url"),
                    external: this.readPropertyContent(External, "url"),
                    description: this.readPropertyContent(Description, "text"),
                    published: this.readPropertyContent(Published, "date-start"),
                    isBlog: this.readPropertyContent(isBlog, "checkbox"),
                    isProject: this.readPropertyContent(isProject, 'checkbox')
                };
            })
    
            return result
    
        }

        const calculateReadTime = (blocks) => {

            let totalWords = 0;

            for (let i = 0; i < blocks.length; i++){
                const blockContent = this.readBlockContent(blocks[i]);

                if (blockContent && blockContent.type !== "image"){
                    blockContent.content.forEach( item => {
                        totalWords += item.plain_text.split(" ").length
                    })
                    //totalWords += blockContent.content[0].split(" ").length
                }
            }

            const time = totalWords / 200;
            const minutes = Math.floor(time)
            const seconds = Math.floor(((time) - Math.floor(time))*60)

            return {
                time,
                minutes,
                seconds
            }

        }

        // Only need to retrieve a single page
        if (id){
            const page = await notion.pages.retrieve({page_id: id})
            const response = parseBlogPostResponse([page])

            const blocks = await notion.blocks.children.list({ block_id: id });

            response[0].readTime = Math.round(calculateReadTime(blocks.results).time)
            

            return response
        }   

        // Get all pages that match the filter
        const res = await notion.databases.query({
            database_id: dbId,
            filter: {
                or: or
            }
        })


        if (!res) throw new Error("cannot query")

        // Calculating read time by getting blocks
        const response = await Promise.all(parseBlogPostResponse(res.results).map( async item => {
            const blocks = await notion.blocks.children.list({ block_id: item.id });
            
            return {
                ...item,
                readTime: Math.round(calculateReadTime(blocks.results).time)
            }
        }));
        
        
        return response;
    }

    getBlogContent = async (pageId) => {
        const blocks = await this.notion.blocks.children.list({block_id: pageId});

        
        // if type is not being read, filter it out
        const response = blocks.results.map( block => {
            return this.readBlockContent(block)
        }).filter( item => item !== undefined);

        //console.log(response)

        // Combining numbered list items into a single object { type: 'ol-li', content: ["item1"]}, { type: 'ol-li', content: ["item2"]} => { type: 'ol', content: ["item1", "item2"]}
        // TODO: extend this for ul as well
        // TODO: refactor

        const mergeListItems = ( contentBlocks, typeToMerge, typeMerged ) => {
            let result = [...contentBlocks]
            let temp = [];
            for (let i = 0; i < contentBlocks.length; i++){
                const curr = contentBlocks[i]

                if (curr.type === typeToMerge){
                    if ((i - 1) > 0 && contentBlocks[i - 1].type !== typeToMerge){
                        
                        temp.push(i)
                    }else if ((i+1) < contentBlocks.length - 1 && contentBlocks[i+1].type !== typeToMerge){
                        temp.push(i)
                    }
                }

                if (temp.length !== 0 && temp.length % 2 === 0){
                    const [start, end] = temp;
                    console.log({start, end})
                    for (let j = start+1; j <= end; j++ ){
                        contentBlocks[start].content.push(...contentBlocks[j].content);
                    }

                    contentBlocks[start].type = typeMerged

                    temp = [];
                }
            }

            return contentBlocks.filter( block => block.type !== typeToMerge)
        }

        
        return mergeListItems(mergeListItems(response, "numbered_list_item", "ordered_list"), "bulleted_list_item", "unordered_list").filter( block => {
            return block.content.length > 0
        })

    }

    
    getExperienceInfo = async () => {
        const { notion, dbId } = this;

        const res = await notion.databases.query({
            database_id: dbId,
            sorts: [
                {
                    property: "Timeframe",
                    direction: "descending"
                }
            ]
        })

        

        const monthYear = (dateStr) => {
            const [y, m, d] = dateStr.split("-").map( num => parseInt(num))
            
            
            const date = new Date(y, m - 1, d)
            const month = date.toLocaleString("en-US", { month: "long"})
            
            return `${month} ${y}`;
        }

        const result = res.results.map( item => {
            const { Name, Timeframe, Role, Description, Type, Skills } = item.properties;
            const company = this.readPropertyContent(Name, "title")
            const description = Description.rich_text.map( textBlock => {
                const { plain_text, annotations } = textBlock
                return {
                    plain_text,
                    annotations
                }
            })
            const role = this.readPropertyContent(Role, "text")
            const type = this.readPropertyContent(Type, "select")
            const skills = this.readPropertyContent(Skills, "multi-select")
            const startDate = this.readPropertyContent(Timeframe, "date-start")
            const endDate = this.readPropertyContent(Timeframe, "date-end")
            
            
            //console.log(textDescription)

            return {
                company,
                role,
                description,
                type,
                skills,
                timeframe: {
                    start: monthYear(startDate),
                    end: endDate ? monthYear(endDate) : "Present"
                }
            }

        })

        return result
    }


    

}

module.exports = Notion
const { Client } = require("@notionhq/client")

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
            case "date":
                return property.date.start
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
        switch (block.type) {
            case "heading_1":
                return {type: "h1", content: [block.heading_1.text[0].plain_text]}
                break;
            case "heading_2":
                return {type: "h2", content: [block.heading_2.text[0].plain_text]}
                break
            
            case "heading_3":
                return {type: "h3", content: [block.heading_3.text[0].plain_text]}
                break
            
            case "paragraph":
                if (block.paragraph.text.length > 0){
                    return {type: "p", content: [block.paragraph.text[0].plain_text]}
                }

                break
            
            case "numbered_list_item":
                return { type: "ol-li", content: [block.numbered_list_item.text[0].plain_text]}
                break
            
            case "image":
                
                return { type: "image", content: [block.image.file.url, block.image.caption.length > 0 ? block.image.caption[0].plain_text : ""]}
                
                
               break
            default:
                
                return undefined
                break;
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
                    published: this.readPropertyContent(Published, "date"),
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

                if (blockContent){
                    totalWords += blockContent.content[0].split(" ").length
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
        let temp = [];
        for (let i = 0; i < response.length; i++){

            const curr = response[i];

            
            // previous type is not ol-li and curr type is (first index)
            if ((i-1) > 0 && curr.type === "ol-li" && response[i-1].type !== "ol-li"){    
                temp.push(i)
            // next type is not ol-li and curr type is (last index)
            }else if ((i+1) < response.length - 1 && curr.type === "ol-li" && response[i+1].type !== 'ol-li'){
                temp.push(i)
            }

            // temp arr has 2 items (start, end)
            if (temp.length !== 0 && temp.length % 2 == 0 ){
                
                const [start, end] = temp;


                for (let j = start; j <= end; j++){
                    if (j !== start){
                        // add all consecutive items to the end of first items content array
                        response[start].content.push(response[j].content[0]);
                    }
                }
                // change the first items type to ol as all items are added
                response[start].type = "ol";
                
                // reinitialize temp
                temp = []
            }

        }


        
        // remove all the "ol-li" types as they are redundant
        return response.filter( item => item.type !== 'ol-li')

    }

    getTimelineInfo = async () => {
        const { notion, dbId } = this;

        const res = await notion.databases.query({
            database_id: dbId,
            sorts: [
                {
                    property: "Year",
                    direction: "descending"
                }
            ]
        })

        // Returns an array of all the years in the timeline data
        const getAllYears = (resp) => {
            const years = resp.map( page => {
                return this.readPropertyContent(page.properties.Year, "select")
            })

            return [... new Set(years)]
        }

        const results = await Promise.all(getAllYears(res.results).map( async year => {
            const notionYearData = await notion.databases.query({
                database_id: dbId,
                filter: {
                    or: [
                        {
                            property: "Year",
                            select: {
                                equals: year
                            }
                        }
                    ]
                }
            })


            
            return {
                year: parseInt(year),
                yearData: notionYearData.results.map( item => {
                    const { Title, Description } = item.properties;
                    return {
                        title: this.readPropertyContent(Title, "title"),
                        description: this.readPropertyContent(Description, "text")
                    }
                })
            }
        }))

        return results
    }


    

}

module.exports = Notion
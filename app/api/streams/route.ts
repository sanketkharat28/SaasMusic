import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"
//@ts-ignore
import youtubesearchapi from "youtube-search-api"
import { collectSegmentData } from "next/dist/server/app-render/collect-segment-data";
import { YT_REGEX } from "@/app/lib/utils";

const CreateStreamSchema = z.object({
    creatorId : z.string(),
    url : z.string() 
})

export async function POST(req:NextRequest) {
    try{
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = data.url.match(YT_REGEX);

        if(!isYt) {
            return NextResponse.json({
                Message : "wrong URL format"
            },{
                status : 411
            })
        }

        const extractedId = data.url.split("?v=")[1];
        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a: {width: number}, b: {width: number}) => a.width < b.width ? - 1 : 1)

        const stream = await prismaClient.stream.create({
            data : {
                userId : data.creatorId,
                url : data.url,
                extractedId,
                title: res.title ?? "cant find video",
                smallImg : (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url) ?? "https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg",
                bigImg : thumbnails[thumbnails.length - 1].url ?? "https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg",
                type : "Youtube"
            }
        })

        return NextResponse.json({
            ...stream,
            hasUpvoted : false,
            upvotes : 0
        })
    } catch(e) {
        console.log(e);
        return NextResponse.json({
            message : "error while adding a stream",
        }, {
            status : 411
        })
    }
    
}

export async function GET(req : NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId")
    if(!creatorId) {
        return NextResponse.json({
            message : "Error"
        }, {
            status : 411
        })
    }
    const streams = await prismaClient.stream.findMany({
        where : {
            userId : creatorId ?? ""
        },
        include : {
            _count : {
                select : {
                    upvotes : true
                }
            },
            upvotes : {
                where : {
                    userId : creatorId
                }
            }
        }
    })

    return NextResponse.json({
        streams : streams.map(({_count, ...rest})=>({
            ...rest,
            upvotes: _count.upvotes,
            haveUpvoted : rest.upvotes.length ? true : false
        }))
    }) 
}
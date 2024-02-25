import { context } from "@/lib/utils";
import { NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI();

async function getOrderRespose(conversatinHistory: any) {
  const respose = await openai.chat.completions.create({
    messages: [...context, ...conversatinHistory],
    model: "gpt-3.5-turbo",
    max_tokens: 150,
  });
  return respose.choices[0].message;
}
async function orderPizza(orderPizza: any) {
  let conversationHistory = [];
  conversationHistory.push({
    role: "user",
    content: orderPizza,
  });
  const response = await getOrderRespose(conversationHistory);
  return response;
}
export async function POST(request: Request, respose: Response) {
  const { prompt } = await request.json();
  let sys_res = await orderPizza(prompt);
  return NextResponse.json(sys_res);
}

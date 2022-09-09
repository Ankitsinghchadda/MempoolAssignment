import { ethers } from 'ethers'
import { config } from "dotenv"
import TelegramBot from 'node-telegram-bot-api'

config();

const telegramBot = process.env.TelegramBot
const chatId = "1660125661"
// Initialize and connect the bot
const bot = new TelegramBot(telegramBot, {
    polling: true
});

bot.onText(/\/echo (.+)/, function (msg, match) {
    console.log(msg.chat.id);

    const data = match[1];

    bot.sendMessage(msg.chat.id, data);
});

const Token = process.env.Token
const UniswapV3 = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
const particularValue = 10 ** 16


// ethers.utils.keccack256(ethers.utils.toUtf8Bytes("swap(address,uint256,uint256,uin256,uint256,address)"))
// console.log(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Mint(address,address,int24,int24,uint128,uint256, uint256)")))
// console.log(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Burn(address,int24,int24,uint128,uint256,uint256);")))
const burn_encoded = "0x8e8207713aff187ed12190e83bb12032346a76c9bba056a0379c2a62071ea910"
const mine_encoded = "0x0ad49a10e033ab6cf8801f820887d0deb2a618e1c5d3382403035ef6ea007558"
const Swap_encoded = "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"
const Swap_encoded2 = "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67"
const main = async () => {
    const provider = new ethers.providers.WebSocketProvider(`wss://newest-stylish-arm.discover.quiknode.pro/${Token}/`)
    provider.on("pending", async (tx) => {
        const txInfo = await provider.getTransaction(tx);
        try {
            if (txInfo.to == UniswapV3) {
                // console.log(txInfo.hash)
                // console.log("inside");
                // const iface = new ethers.utils.Interface(ABI);
                // let decodedData = iface.parseTransaction({ data: txInfo.data, value: txInfo.value });
                // console.log(decodedData);
                await txInfo.wait(1)
                const txRecieptInfo = await provider.getTransactionReceipt(txInfo.hash);
                console.log("inside")
                txRecieptInfo.logs.forEach((log) => {
                    if (log.topics[0] == Swap_encoded) {
                        const logData = ethers.utils.defaultAbiCoder.decode(['uint256', 'uint256', 'uint256', 'uint256'], log.data)
                        console.log({ "before": (parseInt(logData[0])).toString() })
                        if (parseInt(logData[0]) > particularValue) {
                            console.log((parseInt(logData[0])).toString())
                            console.log(message)
                            bot.sendMessage(chatId, `Swap greater then a particular value in tx: ${txRecieptInfo.transactionHash}`)
                        }


                    }
                    else if (log.topics[0] == Swap_encoded2) {
                        const logData = ethers.utils.defaultAbiCoder.decode(['int256 ', 'int256 ', 'uint160 ', 'uint128', 'int24'], log.data)

                        if (parseInt(logData[0]) > particularValue) {
                            console.log(parseInt(logData[0]).toString())

                            bot.sendMessage(chatId, `Swap greater then a particular value in tx: ${txRecieptInfo.transactionHash} `)
                        }
                    }
                    else if (log.topics[0] == mine_encoded) {

                        bot.sendMessage(chatId, `Token Mined in tx: ${txRecieptInfo.transactionHash}`)
                    }
                    else if (log.topics[0] == burn_encoded) {
                        bot.sendMessage(chatId, `Token Burned in tx: ${txRecieptInfo.transactionHash}`)
                    }
                })
            }
        }

        catch {

            console.log("error", { tx });
        }

    })
}

main()


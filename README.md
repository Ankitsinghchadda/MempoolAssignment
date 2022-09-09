# MempoolAssignment

The core idea is to stream mempool data to a sink like websockets. We should also support creating an alert for a particular protocol like uniswap, on top of the mempool data.

For the assignment, lets do the following:

Fetch and stream mempool data to a websocket (we need to run a full-node for this, QuickNode and others provide a free access upto a limit)
Filter mempool data related to Uniswap V3
Send notifications to another websocket/email/telegram when a) a swap greater than a particular value happens on a particular pool, or b) when liquidity providers mint or burn liquidity in a pool of a particular size


# Final Result

![Screenshot (67)](https://user-images.githubusercontent.com/75713738/189438360-d821957d-1876-4c0b-b0cb-b1597e858403.png)

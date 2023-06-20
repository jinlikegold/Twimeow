import { tweetsData as placeholderTweets } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


/* Click Handlers */

document.addEventListener('click', function(e){
   if(e.target.dataset.like){
      handleLikeClick(e.target.dataset.like)
   }
   else if(e.target.dataset.retweet){
       handleRetweetClick(e.target.dataset.retweet)
   }
   else if(e.target.dataset.reply){
       handleReplyClick(e.target.dataset.reply)
   }
   else if(e.target.id === 'tweet-btn'){
       handleTweetBtnClick()
   } 
   else if(e.target.id === 'delete-btn'){
        deleteStoredData()
   }
   else if(e.target.dataset.deleteTweet){
        handleToggleDeleteTweetClick(e.target.dataset.deleteTweet)
   } 
   else if(e.target.dataset.restoreTweet){
        handleToggleDeleteTweetClick(e.target.dataset.restoreTweet)
   }
   else if(e.target.dataset.tweetReplyBtn){
        handleReplyBtnClick(e.target.dataset.tweetReplyBtn)
   }
   else if(e.target.dataset.deleteReply){
        handleReplyDeleteClick(e.target.dataset.tweetUuid, e.target.dataset.deleteReply)
   }
})

/* Function Declarations */

function handleLikeClick(tweetId){
   const targetTweetObj = tweetsData.filter(function(tweet){
       return tweet.uuid === tweetId
   })[0]

   if (targetTweetObj.isLiked){
       targetTweetObj.likes--
   }
   else{
       targetTweetObj.likes++
   }
   targetTweetObj.isLiked = !targetTweetObj.isLiked
   updateFeed()
}


function handleRetweetClick(tweetId){
   const targetTweetObj = tweetsData.filter(function(tweet){
       return tweet.uuid === tweetId
   })[0]
  
   if(targetTweetObj.isRetweeted){
       targetTweetObj.retweets--
   }
   else{
       targetTweetObj.retweets++
   }
   targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
   updateFeed()
}


function handleReplyClick(tweetId){

    const targetTweetObj = tweetsData.filter((tweet) => {
        return tweet.uuid === tweetId
    })[0]

    targetTweetObj.isExpanded = ! targetTweetObj.isExpanded
    updateFeed()

}


function handleToggleDeleteTweetClick(tweetId){
   const targetTweetObj = tweetsData.filter((tweet) => {
       return tweet.uuid === tweetId
   })[0]
  
   targetTweetObj.isDeleted = !targetTweetObj.isDeleted
   updateFeed()
}


function handleTweetBtnClick(){
   const tweetInput = document.getElementById('tweet-input')

   if(tweetInput.value){
       tweetsData.unshift({
           handle: `@AnonymousCat`,
           profilePic: `images/cat.png`,
           likes: 0,
           retweets: 0,
           tweetText: tweetInput.value,
           replies: [],
           isLiked: false,
           isRetweeted: false,
           canDelete: true,
           isExpanded: false,
           isDeleted: false,
           uuid: uuidv4()
       })
   updateFeed()
   tweetInput.value = ''
   }

}


function handleReplyBtnClick(tweetId){
    
    const targetTweetObj = tweetsData.filter((tweet) => {
       return tweet.uuid === tweetId
   })[0]

   const replyTextAreas = document.getElementsByClassName('reply-text-area')
   
    for(let i=0; i<replyTextAreas.length; i++){
        if(tweetId === replyTextAreas[i].dataset.tweetReply){
            console.log('first if statement is working')
            if(replyTextAreas[i].value){
                console.log('second if statement should only go if you entered a value')
                targetTweetObj.replies.push({
                        handle: `@AnonymousCat`,
                        profilePic: `images/cat.png`,
                        tweetText: replyTextAreas[i].value,
                        canDelete: true,
                        isDeleted: false,
                        uuid: uuidv4(),
                    })
            }
        }
    }  
    
    updateFeed()

}


function handleReplyDeleteClick(tweetId, replyId){

    /* if only passing in one parameter, though less efficient:

    for(let i=0; i<tweetsData.length; i++){
        for(let j=0; j<tweetsData[i].replies.length; j++){
            const targetReplyObj = tweetsData[i].replies[j]
            if(targetReplyObj.uuid === replyId){
                targetReplyObj.isDeleted = ! targetReplyObj.isDeleted
            }
        }
    }
    */

   const targetTweetObj = tweetsData.filter((tweet) => {
        return tweet.uuid === tweetId
    })[0]
 
      const targetReplyObj = targetTweetObj.replies.filter((reply) => {
         return reply.uuid === replyId
     })[0]

    targetReplyObj.isDeleted = ! targetReplyObj.isDeleted

    updateFeed()

}

function deleteStoredData() {
    localStorage.clear()
    tweetsData = JSON.parse(JSON.stringify(placeholderTweets))
    updateFeed()
}

function getFeedHtml(){
   let feedHtml = ``

   tweetsData.forEach(function(tweet){
      
       let likeIconClass = ''
      
       if (tweet.isLiked){
           likeIconClass = 'liked'
       }
      
       let retweetIconClass = ''
      
       if (tweet.isRetweeted){
           retweetIconClass = 'retweeted'
       }
      
       let repliesHtml = ''
      
       if(tweet.replies.length > 0){
           tweet.replies.forEach(function(reply){
                if(!reply.isDeleted){
                repliesHtml+=`
                <div class="tweet-reply">
                <div class="tweet-inner">
                    <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                `
                    if(reply.canDelete){
                        repliesHtml+= `
                        <i class="fa-solid fa-trash" data-tweet-uuid="${tweet.uuid}"
                        data-delete-reply="${reply.uuid}"
                        ></i>
                        `
                    }

                repliesHtml += `
                </div>
                </div>
                </div>
                `
                }
           })
       }

       let tweetReplyCount = tweet.replies.filter((reply)=>{
        return !reply.isDeleted
       }).length
      
       if(!tweet.isDeleted){
       feedHtml += `
        <div class="tweet">
        <div class="tweet-inner">
            <img src="${tweet.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${tweet.handle}</p>
                <p class="tweet-text">${tweet.tweetText}</p>
                <div class="tweet-details">
                    <span class="tweet-detail">
                        <i class="fa-regular fa-comment-dots"
                        data-reply="${tweet.uuid}"
                        ></i>
                        ${tweetReplyCount}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${likeIconClass}"
                        data-like="${tweet.uuid}"
                        ></i>
                        ${tweet.likes}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweetIconClass}"
                        data-retweet="${tweet.uuid}"
                        ></i>
                        ${tweet.retweets}
                    </span>`
              
               if(tweet.canDelete){
                   feedHtml+= `
                   <span class="tweet-detail">
                   <i class="fa-solid fa-trash"
                   data-delete-tweet="${tweet.uuid}"
                   ></i>
               </span>
                   `
               }

               feedHtml += `
                </div>  
                </div>           
                </div>
               `

               if(tweet.isExpanded) {
                feedHtml += `
                    <div class="reply-area">
                        <textarea class="reply-text-area" data-tweet-reply="${tweet.uuid}"></textarea>
                        <button class="reply-btn" data-tweet-reply-btn="${tweet.uuid}">Reply</button>
                            <div id="replies-${tweet.uuid}">
                                ${repliesHtml}
                            </div>
                    </div>  
                    `
                    
                }

                feedHtml +=`
                </div>
                `
    
 } else {

    feedHtml+= `
        <div>
            <p>Tweet deleted. Restore?</p>
            <i class="fa-solid fa-rotate-left" 
            data-restore-tweet="${tweet.uuid}"
            ></i>
        </div>
    `
    }

  })

  return feedHtml

}


function updateFeed(){

   document.getElementById('feed').innerHTML = getFeedHtml()

   localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
}


function loadFeedfromStorage(){

    tweetsData = JSON.parse(localStorage.getItem('tweetsData'))

    if(tweetsData === null){
        tweetsData = JSON.parse(JSON.stringify(placeholderTweets))
    }

}

/* Code that runs on page load */

function onLoad() {

    loadFeedfromStorage()
    updateFeed()

}

let tweetsData = []

onLoad()



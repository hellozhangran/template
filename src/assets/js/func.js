export function getStringLimited(content, num){
    num = num || 5
    const len = content.length
    let current = 0
    let limitedIndex = len - 1
    for(let i = 0; i < len; i++){
      if(content.charCodeAt(i) > 127 || content.charCodeAt(i) == 94){
        current+= 2
      }else{
        current++
      }
      if(current >= num * 2){
        limitedIndex = i
        break;
      }
    }
    let tails = limitedIndex < len - 1 ? '...' : '' 
    return content.substring(0, limitedIndex+1) + tails
  }
  
  
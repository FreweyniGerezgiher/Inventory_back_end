const success = (data, message) =>{
    return{
        success: 1,
        data: data || [],
        message: message || '',
        error: null,
    }
}

const err = (data, message) =>{
    return {
        success: 0,
        data: data || null,
        error: message || ''
    }
}

module.exports ={
    success:success,
    err: err
}
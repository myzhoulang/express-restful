const optional = {
  options: {
    // false 为不能传 falsely(0,"",false)
    checkFalsy: true,
    // false 为不能传null
    nullable: false,
  },
}
const isOptional = (method: HttpMethods) => {
  if (method === 'PATCH') {
    return {
      optional,
    }
  } else {
    return {
      notEmpty: {
        errorMessage: '值不能为空',
      },
    }
  }
}

export { isOptional, optional }

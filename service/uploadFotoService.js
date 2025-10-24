const uploadFotoData = require("../data/uploadFotoData");
const erroDB = require('../util/userfunctiondb');

exports.saveFoto = async ( originalname, buffer) => { 
  try 
  {
    
    return uploadFotoData.saveFoto(originalname, buffer);
  }
  catch (err)
  { 
    throw new erroDB.UserException(err.erro, err); 
  }

};


exports.saveFotoV2 = async (id_empresa,id_evento,originalname, buffer,user_insert) => { 
  try 
  {
    
    return uploadFotoData.saveFotoV2(id_empresa,id_evento,originalname, buffer,user_insert);
  }
  catch (err)
  { 
    throw new erroDB.UserException(err.erro, err); 
  }

};

exports.getFotoV2 = async (id_empresa,id_evento,id) => { 
  try 
  {
    
    return uploadFotoData.getFotoV2(id_empresa,id_evento,id);
  }
  catch (err)
  { 
    throw new erroDB.UserException(err.erro, err); 
  }

};

 

exports.deleteFoto = async (id_empresa,id_evento,id) => { 
  try 
  {
    
    return uploadFotoData.deleteFoto(id_empresa,id_evento,id);
  }
  catch (err)
  { 
    throw new erroDB.UserException(err.erro, err); 
  }
};
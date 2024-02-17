import supabase from "../database/database.js";

export const uploadtoiletcomment = async (req, res) => {
  const file = req.file;
  const { commentid } = req.body;
  const newminetype = "image/jpeg";
  const newfilename = `toilet_comment_${id}.jpeg`;
  const { data, error } = await supabase
    .from("toilet_comment")
    .select("picture")
    .eq("id", commentid);
  if (error) throw error;
  else if (data.length === 0) {
    res.status(404).send("toilet not found");
  } else if (data[0].pictre === null) {
    const { data: datapicture, error } = await supabase.storage
      .select("restroom_comment")
      .upload(newfilename, file.buffer, {
        contentType: newminetype,
      });
    if (error) throw error;
    else {
      const url = `https://pyygounrrwlsziojzlmu.supabase.co/storage/v1/object/public/${datapicture.fullPath}`;
      const { data, err } = await supabase
        .from("toilet_comment")
        .update({ profile: url })
        .eq("id", commentid)
        .select();
      if (err) throw err;
      else {
        res.send(data);
      }
    }
  } else {
    const { data, err } = await supabase.storage
      .from("restroom")
      .update(newfilename, file.buffer, {
        contentType: newminetype,
      });
    if (err) throw err;
    else {
      res.send(data);
    }
  }
};

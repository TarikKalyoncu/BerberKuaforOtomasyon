import { Client } from "@gradio/client";

(async () => {
  try {
    // Örnek bir resim dosyasını yükleme (URL'den)
    const response = await fetch("https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png");
    const exampleImage = await response.blob();

    // Gradio Client'e bağlanma
    const client = await Client.connect("Gradio-Blocks/HairCLIP");

    // Saç modeli için yüzü hizalama
    const detectResult = await client.predict("/detect_and_align_face", {
      image: exampleImage,
    });
    console.log("Hizalanmış Yüz:", detectResult.data);

    // Rekonstrüksiyon işlemi
    const reconstructResult = await client.predict("/reconstruct_face", {
      image: exampleImage,
    });
    console.log("Rekonstrüksiyon Sonucu:", reconstructResult.data);

    // Saç stili ve renk önerileri
    const styleResult = await client.predict("/generate", {
      editing_type: "hairstyle",
      hairstyle_index: "afro",
      color_description: "dark brown",
    });
    console.log("Saç Modeli ve Renk:", styleResult.data);

  } catch (error) {
    console.error("Hata oluştu:", error);
  }
})();

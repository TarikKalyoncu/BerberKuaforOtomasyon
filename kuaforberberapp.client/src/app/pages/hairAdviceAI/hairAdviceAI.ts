import { Component, OnInit } from '@angular/core';
import { Client } from "@gradio/client";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hairadviceaı',
  templateUrl: './hairAdviceAI.html',
  standalone: false,
  styleUrls: ['./hairAdviceAI.css']
})
export class HairAdviceAIComponent implements OnInit {
  advice: { hairstyle: string; color: string } | null = null;
  reconstructResultUrl: any;
  styleResultUrl: any;

  selectedHairstyle: string = 'afro';  // Default selected hairstyle
  selectedColor: string = 'dark brown';  // Default color (dark brown)

  hairstyles: string[] = [
    'afro', 'bob cut', 'bowl cut', 'braid', 'caesar cut', 'chignon', 'cornrows', 'crew cut',
    'crown braid', 'curtained hair', 'dido flip', 'dreadlocks', 'extensions', 'fade', 'fauxhawk',
    'finger waves', 'french braid', 'frosted tips', 'full crown', 'harvard clip', 'high and tight',
    'hime cut', 'hi-top fade', 'jewfro', 'jheri curl', 'liberty spikes', 'marcel waves', 'mohawk',
    'pageboy', 'perm', 'pixie cut', 'psychobilly wedge', 'quiff', 'regular taper cut', 'ringlets',
    'shingle bob', 'short hair', 'slicked-back', 'spiky hair', 'surfer hair', 'taper cut', 'the rachel',
    'undercut', 'updo'
  ];

  colors: string[] = [
    'dark brown', 'black', 'red', 'yellow', 'blue', 'green', 'purple', 'pink', 'brown', 'orange'
  ];

  ngOnInit(): void { }

  async runHairAI(file: File) {
    try {
      const exampleImage = file;

      const client = await Client.connect("Gradio-Blocks/HairCLIP");

      const detectResult = await client.predict("/detect_and_align_face", {
        image: exampleImage,
      });
      console.log("Hizalanmış Yüz:", detectResult.data);

      const reconstructResult: any = await client.predict("/reconstruct_face", {
        image: exampleImage,
      });
      console.log("Rekonstrüksiyon Sonucu:", reconstructResult.data[0].url);
      this.reconstructResultUrl = reconstructResult.data[0].url;

      const styleResult: any = await client.predict("/generate", {
        editing_type: "both",
        hairstyle_index: this.selectedHairstyle,
        color_description: this.selectedColor,  // Send the color name directly
      });
      console.log("Saç Modeli ve Renk:", styleResult.data);
      this.styleResultUrl = styleResult.data[0].url;

      this.advice = {
        hairstyle: this.selectedHairstyle,
        color: this.selectedColor,
      };

    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.runHairAI(file);
    } else {
      console.error("Dosya yüklenemedi.");
    }
  }
}

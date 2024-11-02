import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GenAIService } from "./genai.service";

@ApiTags("GenAI")
@Controller("api/v1/genai")
export class GenAIController {
  constructor(private readonly _service: GenAIService) {}
}

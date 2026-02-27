import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@ApiTags('Card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um registro de cartão' })
  @ApiBody({ type: CreateCardDto })
  @ApiResponse({ status: 201, description: 'Cartão criado com sucesso.' })
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os cartões' })
  @ApiResponse({ status: 200, description: 'Lista de cartões retornada com sucesso.' })
  findAll() {
    return this.cardService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um cartão por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Cartão encontrado.' })
  @ApiResponse({ status: 404, description: 'Cartão não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um cartão por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCardDto })
  @ApiResponse({ status: 200, description: 'Cartão atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cartão não encontrado.' })
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+id, updateCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um cartão por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Cartão removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cartão não encontrado.' })
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id);
  }
}

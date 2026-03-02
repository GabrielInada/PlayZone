import { Test, TestingModule } from '@nestjs/testing';
import { TournamentKnockoutController } from './tournament-knockout.controller';
import { TournamentKnockoutService } from './tournament-knockout.service';

describe('TournamentKnockoutController', () => {
  let controller: TournamentKnockoutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TournamentKnockoutController],
      providers: [
        {
          provide: TournamentKnockoutService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TournamentKnockoutController>(
      TournamentKnockoutController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

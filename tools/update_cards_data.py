#!/usr/bin/env python3
"""
update_cards_data.py
Aplica todas as correções validadas pelo Thiago na planilha de revisão em cards_data.json.
"""

import json
import os

CARDS_DATA = {
  "S.01": {
    "id": "S.01",
    "type": "basic",
    "arrow": "left",
    "image": "../assets/art/seti/cards/S.01.webp",
    "actions": [
      {
        "num": 1,
        "type": "analyze",
        "titlePt": "Analisar (Computador)",
        "titleEn": "Analyze (Computer)",
        "descPt": "Se o computador estiver cheio: limpa os dados e ganha benefícios. Se tiver uma tecnologia de computador, descarte para +3 PV e +1 progresso.",
        "descEn": "If computer is full: clear all data and gain benefits. Discard computer tech for +3 VP and +1 progress."
      },
      {
        "num": 2,
        "type": "launch_probe",
        "titlePt": "Sonda na Terra",
        "titleEn": "Probe on Earth",
        "descPt": "Lança uma sonda na Terra, caso não tenha uma, e ganha 1 de publicidade.",
        "descEn": "Launch a probe on Earth if there isn't one, and gain 1 Publicity."
      },
      {
        "num": 3,
        "type": "tech",
        "titlePt": "Pesquisar Tecnologia (6 Pub)",
        "titleEn": "Research Technology (6 Pub)",
        "cost": 6,
        "descPt": "Gasta 6 de Publicidade para adquirir sua tecnologia preferida (ou a próxima com 2 PV na trilha).",
        "descEn": "Spends 6 Publicity to take preferred technology (or next with 2 VP on track)."
      },
      {
        "num": 4,
        "type": "move_probe",
        "titlePt": "Mover Sonda (Alcance 3)",
        "titleEn": "Move Probe (Range 3)",
        "range": 3,
        "planets": ["Saturno", "Marte", "Júpiter", "Vênus"],
        "preference": ["moon", "orbiter", "lander"],
        "descPt": "Mova a sonda da Terra (alcance 3): Saturno > Marte > Júpiter > Vênus. Preferência: Lua (descartando tec de sonda) > Orbitador > Aterrissador.",
        "descEn": "Move probe from Earth (range 3): Saturn > Mars > Jupiter > Venus. Prefers Moon (discarding probe tech) > Orbiter > Lander."
      }
    ]
  },
  "S.02": {
    "id": "S.02",
    "type": "basic",
    "arrow": "right",
    "image": "../assets/art/seti/cards/S.02.webp",
    "actions": [
      {
        "num": 1,
        "type": "analyze",
        "titlePt": "Analisar (Computador)",
        "titleEn": "Analyze (Computer)",
        "descPt": "Se o computador estiver cheio: limpa os dados e ganha benefícios. Se o rival tiver uma tecnologia de computador, descarte para +3 PV e +1 progresso.",
        "descEn": "If computer is full: clear data and gain benefits. Discard computer tech for +3 VP and +1 progress."
      },
      {
        "num": 2,
        "type": "tech",
        "titlePt": "Pesquisar Tecnologia (6 Pub)",
        "titleEn": "Research Technology (6 Pub)",
        "cost": 6,
        "descPt": "Gasta 6 de Publicidade para adquirir sua tecnologia preferida (ou a próxima com 2 PV na trilha).",
        "descEn": "Spends 6 Publicity to take preferred technology (or next with 2 VP on track)."
      },
      {
        "num": 3,
        "type": "telescope",
        "titlePt": "Telescópio (Varredura)",
        "titleEn": "Telescope (Scan)",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  },
  "S.03": {
    "id": "S.03",
    "type": "basic",
    "arrow": "left",
    "image": "../assets/art/seti/cards/S.03.webp",
    "actions": [
      {
        "num": 1,
        "type": "species_check",
        "speciesSlot": 1,
        "titlePt": "Checagem de Espécie 1",
        "titleEn": "Species 1 Check",
        "descPt": "Se a 1ª espécie alienígena foi descoberta: substitua esta carta pela carta especial correspondente e resolva-a. Se não, tente a próxima ação.",
        "descEn": "If the 1st alien species was discovered: replace this card with the corresponding special card and resolve it. Otherwise, proceed to next action."
      },
      {
        "num": 2,
        "type": "tech",
        "titlePt": "Pesquisar Tecnologia (6 Pub)",
        "titleEn": "Research Technology (6 Pub)",
        "cost": 6,
        "descPt": "Gasta 6 de Publicidade para adquirir sua tecnologia preferida (ou a próxima com 2 PV na trilha).",
        "descEn": "Spends 6 Publicity to take preferred technology (or next with 2 VP on track)."
      },
      {
        "num": 3,
        "type": "telescope",
        "titlePt": "Telescópio (Varredura)",
        "titleEn": "Telescope (Scan)",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  },
  "S.04": {
    "id": "S.04",
    "type": "basic",
    "arrow": "right",
    "image": "../assets/art/seti/cards/S.04.webp",
    "actions": [
      {
        "num": 1,
        "type": "species_check",
        "speciesSlot": 2,
        "titlePt": "Checagem de Espécie 2",
        "titleEn": "Species 2 Check",
        "descPt": "Se a 2ª espécie alienígena foi descoberta: substitua esta carta pela carta especial correspondente e resolva-a. Se não, tente a próxima ação.",
        "descEn": "If the 2nd alien species was discovered: replace this card with the corresponding special card and resolve it. Otherwise, proceed to next action."
      },
      {
        "num": 2,
        "type": "move_probe",
        "titlePt": "Mover Sonda (Alcance 3)",
        "titleEn": "Move Probe (Range 3)",
        "range": 3,
        "planets": ["Júpiter", "Marte", "Saturno", "Vênus"],
        "preference": ["moon", "orbiter", "lander"],
        "descPt": "Mova a sonda da Terra (alcance 3): Júpiter > Marte > Saturno > Vênus. Preferência: Lua (descartando tec) > Orbitador > Aterrissador.",
        "descEn": "Move probe from Earth (range 3): Jupiter > Mars > Saturn > Venus. Prefers Moon (discarding tech) > Orbiter > Lander."
      },
      {
        "num": 3,
        "type": "tech_free",
        "titlePt": "Tecnologia Grátis (+1 Progresso)",
        "titleEn": "Free Technology (+1 Progress)",
        "cost": 0,
        "descPt": "Adquire sua tecnologia preferida sem gastar publicidade (ou a próxima com 2 PV na trilha). +1 progresso. Nunca pula.",
        "descEn": "Take preferred technology without spending publicity (or next with 2 VP on track). +1 progress. Never skips."
      }
    ]
  },
  "S.05": {
    "id": "S.05",
    "type": "advanced",
    "arrow": "left",
    "image": "../assets/art/seti/cards/S.05.webp",
    "actions": [
      {
        "num": 1,
        "type": "analyze",
        "titlePt": "Analisar (Computador)",
        "titleEn": "Analyze (Computer)",
        "descPt": "Se o computador estiver cheio: limpa os dados e ganha 3 PV + benefícios. Se tiver uma tecnologia de computador, descarte para +3 PV e +1 progresso.",
        "descEn": "If computer is full: clear data and gain 3 VP + benefits. Discard computer tech for +3 VP and +1 progress."
      },
      {
        "num": 2,
        "type": "tech",
        "titlePt": "Pesquisar Tecnologia (6 Pub)",
        "titleEn": "Research Technology (6 Pub)",
        "cost": 6,
        "descPt": "Gasta 6 de Publicidade para adquirir sua tecnologia preferida (ou a próxima com 2 PV na trilha).",
        "descEn": "Spends 6 Publicity to take preferred technology (or next with 2 VP on track)."
      },
      {
        "num": 3,
        "type": "telescope",
        "titlePt": "Telescópio (Varredura)",
        "titleEn": "Telescope (Scan)",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  },
  "S.06": {
    "id": "S.06",
    "type": "advanced",
    "arrow": "left",
    "image": "../assets/art/seti/cards/S.06.webp",
    "actions": [
      {
        "num": 1,
        "type": "tech",
        "titlePt": "Pesquisar Tecnologia (6 Pub)",
        "titleEn": "Research Technology (6 Pub)",
        "cost": 6,
        "descPt": "Gasta 6 de Publicidade para adquirir sua tecnologia preferida (ou a próxima com 2 PV na trilha).",
        "descEn": "Spends 6 Publicity to take preferred technology (or next with 2 VP on track)."
      },
      {
        "num": 2,
        "type": "launch_probe",
        "titlePt": "Sonda na Terra (+1 Progresso)",
        "titleEn": "Probe on Earth (+1 Progress)",
        "descPt": "Lança uma sonda na Terra, caso não tenha uma, e ganha 1 de publicidade e um avanço no progresso.",
        "descEn": "Launch a probe on Earth if there isn't one, gain 1 Publicity and +1 progress."
      },
      {
        "num": 3,
        "type": "telescope",
        "titlePt": "Telescópio (Varredura)",
        "titleEn": "Telescope (Scan)",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  },
  "S.07": {
    "id": "S.07",
    "type": "advanced",
    "arrow": "right",
    "image": "../assets/art/seti/cards/S.07.webp",
    "actions": [
      {
        "num": 1,
        "type": "tech",
        "titlePt": "Pesquisar Tecnologia (6 Pub, +1 Prog)",
        "titleEn": "Research Technology (6 Pub, +1 Prog)",
        "cost": 6,
        "descPt": "Gasta 6 de Publicidade para adquirir sua tecnologia preferida (ou a próxima com 2 PV na trilha). Avança um em progresso.",
        "descEn": "Spends 6 Publicity to take preferred technology (or next with 2 VP on track). +1 progress."
      },
      {
        "num": 2,
        "type": "launch_probe",
        "titlePt": "Sonda na Terra (+1 Progresso)",
        "titleEn": "Probe on Earth (+1 Progress)",
        "descPt": "Lança uma sonda na Terra, caso não tenha uma, e ganha 1 de publicidade e um avanço no progresso.",
        "descEn": "Launch a probe on Earth if there isn't one, gain 1 Publicity and +1 progress."
      },
      {
        "num": 3,
        "type": "telescope",
        "titlePt": "Telescópio (Varredura)",
        "titleEn": "Telescope (Scan)",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  },
  "S.08": {
    "id": "S.08",
    "type": "advanced",
    "arrow": "left",
    "image": "../assets/art/seti/cards/S.08.webp",
    "actions": [
      {
        "num": 1,
        "type": "analyze",
        "titlePt": "Analisar (Computador)",
        "titleEn": "Analyze (Computer)",
        "descPt": "Se o computador estiver cheio: limpa os dados e ganha 3 PV + benefícios. Se tiver uma tecnologia de computador, descarte para +3 PV e +1 progresso.",
        "descEn": "If computer is full: clear data and gain 3 VP + benefits. Discard computer tech for +3 VP and +1 progress."
      },
      {
        "num": 2,
        "type": "move_probe",
        "titlePt": "Mover Sonda (Alcance 4)",
        "titleEn": "Move Probe (Range 4)",
        "range": 4,
        "planets": ["Urano", "Júpiter", "Mercúrio", "Vênus"],
        "preference": ["moon", "lander", "orbiter"],
        "descPt": "Mova a sonda (alcance 4): Urano > Júpiter > Mercúrio > Vênus. Preferência: Lua (desc tec) > Aterrissador > Orbitador.",
        "descEn": "Move probe (range 4): Uranus > Jupiter > Mercury > Venus. Prefers Moon (discard tech) > Lander > Orbiter."
      },
      {
        "num": 3,
        "type": "telescope",
        "titlePt": "Telescópio (Varredura)",
        "titleEn": "Telescope (Scan)",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  },
  "S.09": {
    "id": "S.09",
    "type": "advanced",
    "arrow": "right",
    "image": "../assets/art/seti/cards/S.09.webp",
    "actions": [
      {
        "num": 1,
        "type": "analyze",
        "titlePt": "Analisar (Computador)",
        "titleEn": "Analyze (Computer)",
        "descPt": "Se o computador estiver cheio: limpa os dados e ganha 3 PV + benefícios. Se tiver uma tecnologia de computador, descarte para +3 PV e +1 progresso.",
        "descEn": "If computer is full: clear data and gain 3 VP + benefits. Discard computer tech for +3 VP and +1 progress."
      },
      {
        "num": 2,
        "type": "launch_probe",
        "titlePt": "Sonda na Terra (+1 Progresso)",
        "titleEn": "Probe on Earth (+1 Progress)",
        "descPt": "Lança uma sonda na Terra, caso não tenha uma, e ganha 1 de publicidade e um avanço no progresso.",
        "descEn": "Launch a probe on Earth if there isn't one, gain 1 Publicity and +1 progress."
      },
      {
        "num": 3,
        "type": "telescope",
        "titlePt": "Telescópio (Varredura)",
        "titleEn": "Telescope (Scan)",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  },
  "S.10": {
    "id": "S.10",
    "type": "advanced",
    "arrow": "right",
    "image": "../assets/art/seti/cards/S.10.webp",
    "actions": [
      {
        "num": 1,
        "type": "analyze",
        "titlePt": "Analisar (Computador)",
        "titleEn": "Analyze (Computer)",
        "descPt": "Se o computador estiver cheio: limpa os dados e ganha 3 PV + benefícios. Se tiver uma tecnologia de computador, descarte para +3 PV e +1 progresso.",
        "descEn": "If computer is full: clear data and gain 3 VP + benefits. Discard computer tech for +3 VP and +1 progress."
      },
      {
        "num": 2,
        "type": "launch_probe",
        "titlePt": "Sonda na Terra (+1 Progresso)",
        "titleEn": "Probe on Earth (+1 Progress)",
        "descPt": "Lança uma sonda na Terra, caso não tenha uma, e ganha 1 de publicidade e um avanço no progresso.",
        "descEn": "Launch a probe on Earth if there isn't one, gain 1 Publicity and +1 progress."
      },
      {
        "num": 3,
        "type": "telescope",
        "titlePt": "Telescópio (Varredura)",
        "titleEn": "Telescope (Scan)",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  },
  "S.11": {
    "id": "S.11",
    "type": "advanced",
    "arrow": "right",
    "image": "../assets/art/seti/cards/S.11.webp",
    "actions": [
      {
        "num": 1,
        "type": "tech",
        "titlePt": "Pesquisar Tecnologia (6 Pub, +1 Prog)",
        "titleEn": "Research Technology (6 Pub, +1 Prog)",
        "cost": 6,
        "descPt": "Gasta 6 de Publicidade para adquirir sua tecnologia preferida (ou a próxima com 2 PV na trilha). Ganha +1 progresso.",
        "descEn": "Spends 6 Publicity to take preferred technology (or next with 2 VP on track). +1 progress."
      },
      {
        "num": 2,
        "type": "analyze",
        "titlePt": "Analisar (Computador)",
        "titleEn": "Analyze (Computer)",
        "descPt": "Se o computador estiver cheio: limpa os dados e ganha 3 PV + benefícios. Se tiver uma tecnologia de computador, descarte para +3 PV e +1 progresso.",
        "descEn": "If computer is full: clear data and gain 3 VP + benefits. Discard computer tech for +3 VP and +1 progress."
      },
      {
        "num": 3,
        "type": "telescope",
        "titlePt": "Telescópio (Varredura)",
        "titleEn": "Telescope (Scan)",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  },
  "S.12": {
    "id": "S.12",
    "type": "advanced",
    "arrow": "left",
    "image": "../assets/art/seti/cards/S.12.webp",
    "actions": [
      {
        "num": 1,
        "type": "tech",
        "titlePt": "Pesquisar Tecnologia (6 Pub, +1 Prog)",
        "titleEn": "Research Technology (6 Pub, +1 Prog)",
        "cost": 6,
        "descPt": "Gasta 6 de Publicidade para adquirir sua tecnologia preferida (ou a próxima com 2 PV na trilha). Avança um em progresso.",
        "descEn": "Spends 6 Publicity to take preferred technology (or next with 2 VP on track). +1 progress."
      },
      {
        "num": 2,
        "type": "launch_probe",
        "titlePt": "Sonda na Terra (+1 Progresso)",
        "titleEn": "Probe on Earth (+1 Progress)",
        "descPt": "Lança uma sonda na Terra, caso não tenha uma, e ganha 1 de publicidade e um avanço no progresso.",
        "descEn": "Launch a probe on Earth if there isn't one, gain 1 Publicity and +1 progress."
      },
      {
        "num": 3,
        "type": "move_probe",
        "titlePt": "Mover Sonda (Alcance 4)",
        "titleEn": "Move Probe (Range 4)",
        "range": 4,
        "planets": ["Mercúrio", "Saturno", "Júpiter", "Vênus"],
        "preference": ["moon", "lander", "orbiter"],
        "descPt": "Mova a sonda (alcance 4): Mercúrio > Saturno > Júpiter > Vênus. Preferência: Lua (desc tec) > Aterrissador > Orbitador.",
        "descEn": "Move probe (range 4): Mercury > Saturn > Jupiter > Venus. Prefers Moon (discard tech) > Lander > Orbiter."
      }
    ]
  },
  "S.13": {
    "id": "S.13",
    "type": "advanced",
    "arrow": "left",
    "image": "../assets/art/seti/cards/S.13.webp",
    "actions": [
      {
        "num": 1,
        "type": "move_probe",
        "titlePt": "Mover Sonda (Alcance 4)",
        "titleEn": "Move Probe (Range 4)",
        "range": 4,
        "planets": ["Netuno", "Urano", "Marte", "Vênus"],
        "preference": ["moon", "lander", "orbiter"],
        "descPt": "Mova a sonda (alcance 4): Netuno > Urano > Marte > Vênus. Preferência: Lua (desc tec) > Aterrissador > Orbitador.",
        "descEn": "Move probe (range 4): Neptune > Uranus > Mars > Venus. Prefers Moon (discard tech) > Lander > Orbiter."
      },
      {
        "num": 2,
        "type": "analyze",
        "titlePt": "Analisar (Computador)",
        "titleEn": "Analyze (Computer)",
        "descPt": "Se o computador estiver cheio: limpa os dados e ganha 3 PV + benefícios. Se tiver uma tecnologia de computador, descarte para +3 PV e +1 progresso.",
        "descEn": "If computer is full: clear data and gain 3 VP + benefits. Discard computer tech for +3 VP and +1 progress."
      },
      {
        "num": 3,
        "type": "telescope",
        "titlePt": "Telescópio (Varredura)",
        "titleEn": "Telescope (Scan)",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  },
  "S.14": {
    "id": "S.14",
    "type": "advanced",
    "arrow": "right",
    "image": "../assets/art/seti/cards/S.14.webp",
    "actions": [
      {
        "num": 1,
        "type": "launch_probe",
        "titlePt": "Sonda na Terra (+1 Progresso)",
        "titleEn": "Probe on Earth (+1 Progress)",
        "descPt": "Lança uma sonda na Terra, caso não tenha uma, e ganha 1 de publicidade e um avanço no progresso.",
        "descEn": "Launch a probe on Earth if there isn't one, gain 1 Publicity and +1 progress."
      },
      {
        "num": 2,
        "type": "tech",
        "titlePt": "Pesquisar Tecnologia (6 Pub, +1 Prog)",
        "titleEn": "Research Technology (6 Pub, +1 Prog)",
        "cost": 6,
        "descPt": "Gasta 6 de Publicidade para adquirir sua tecnologia preferida (ou a próxima com 2 PV na trilha). Avança um em progresso.",
        "descEn": "Spends 6 Publicity to take preferred technology (or next with 2 VP on track). +1 progress."
      },
      {
        "num": 3,
        "type": "telescope",
        "titlePt": "Telescópio (Varredura)",
        "titleEn": "Telescope (Scan)",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  },
  "S.EXP1": {
    "id": "S.EXP1",
    "type": "expansion",
    "arrow": "left",
    "image": "../assets/art/seti/cards/S.EXP1.webp",
    "actions": [
      {
        "num": 1,
        "type": "wild_life_trace",
        "titlePt": "Vestígio de Vida Selvagem (+ Progresso por Dificuldade)",
        "titleEn": "Wild Life Trace (+ Difficulty Progress)",
        "descPt": "O rival marca o espaço mais abaixo disponível na coluna de qualquer espécie alienígena (seta para desempate). + 1 de progresso para cada estrela de dificuldade do bot.",
        "descEn": "The rival marks the lowest available space in the column of any alien species (arrow ties). +1 progress for each difficulty star of the bot."
      }
    ]
  },
  "species_mascamitas": {
    "id": "species_mascamitas",
    "type": "species",
    "arrow": "right",
    "image": "../assets/art/seti/cards/species_mascamitas.webp",
    "actions": [
      {
        "num": 1,
        "type": "launch_probe",
        "titlePt": "Sonda na Terra",
        "titleEn": "Probe on Earth",
        "descPt": "Lança uma sonda na Terra, caso não tenha uma, e ganha 1 de publicidade.",
        "descEn": "Launch a probe on Earth if there isn't one, and gain 1 Publicity."
      },
      {
        "num": 2,
        "type": "move_probe",
        "titlePt": "Mover Sonda (Saturno 4 / Júpiter 5) + Coletar Amostra",
        "titleEn": "Move Probe (Saturn 4 / Jupiter 5) + Sample",
        "range": 5,
        "planets": ["Saturno", "Júpiter"],
        "preference": ["moon", "lander"],
        "descPt": "Mova a sonda para Saturno (alcance 4) ou Júpiter (alcance 5). Preferência: Lua (desc tec) > Aterrissador. Pegue aleatoriamente uma amostra do planeta e coloque-a virada para cima no tabuleiro desta espécie (ignore recompensa). Ignore se a sonda não consegue chegar em Saturno ou Júpiter.",
        "descEn": "Move probe to Saturn (range 4) or Jupiter (range 5). Prefers Moon (discard tech) > Lander. Randomly take a planetary sample and place it faceup on this species board (ignore reward). Skip if probe cannot reach Saturn or Jupiter."
      }
    ]
  },
  "species_anomalias": {
    "id": "species_anomalias",
    "type": "species",
    "arrow": "left",
    "image": "../assets/art/seti/cards/species_anomalias.webp",
    "actions": [
      {
        "num": 1,
        "type": "species_effect",
        "titlePt": "Marcar Anomalia",
        "titleEn": "Mark Anomaly",
        "descPt": "Se o rival não estiver ganhando a próxima anomalia, ele marca o vestígio daquela cor para esta espécie e ganha +3 PV.",
        "descEn": "If rival is not winning the next anomaly, mark the life trace of that color for this species and gain +3 VP."
      },
      {
        "num": 2,
        "type": "tech_free",
        "titlePt": "Tecnologia Grátis (+1 Progresso)",
        "titleEn": "Free Technology (+1 Progress)",
        "cost": 0,
        "descPt": "Adquire sua tecnologia preferida sem gastar publicidade (ou a próxima com 2 PV na trilha). +1 progresso. Nunca pula.",
        "descEn": "Take preferred technology without spending publicity (or next with 2 VP on track). +1 progress. Never skips."
      }
    ]
  },
  "species_oumuamua": {
    "id": "species_oumuamua",
    "type": "species",
    "arrow": "left",
    "image": "../assets/art/seti/cards/species_oumuamua.webp",
    "actions": [
      {
        "num": 1,
        "type": "move_probe",
        "titlePt": "Mover Sonda para 'Oumuamua",
        "titleEn": "Move Probe to 'Oumuamua",
        "range": 4,
        "planets": ["'Oumuamua"],
        "preference": ["lander", "orbiter"],
        "descPt": "Mova a sonda para 'Oumuamua (alcance 4). Preferência: Aterrissador > Orbitador. Realiza apenas se a sonda consegue chegar em Oumuamua.",
        "descEn": "Move probe to 'Oumuamua (range 4). Prefers Lander > Orbiter. Only performs if probe can reach 'Oumuamua."
      },
      {
        "num": 2,
        "type": "telescope",
        "titlePt": "Telescópio Especial",
        "titleEn": "Special Telescope",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  },
  "species_centaurianos": {
    "id": "species_centaurianos",
    "type": "species",
    "arrow": "right",
    "image": "../assets/art/seti/cards/species_centaurianos.webp",
    "actions": [
      {
        "num": 1,
        "type": "species_effect",
        "titlePt": "Marcador +15 Pontos",
        "titleEn": "Marker +15 Points",
        "descPt": "Se o rival ainda tiver marcador em sua reserva e nenhum na trilha de pontuação, coloque um +15 à frente de sua pontuação atual. Em seguida, +1 progresso.",
        "descEn": "If rival has a message marker and none on track, place it 15 VP ahead. Then +1 progress."
      },
      {
        "num": 2,
        "type": "telescope",
        "titlePt": "Telescópio (Varredura)",
        "titleEn": "Telescope (Scan)",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  },
  "species_exertianos": {
    "id": "species_exertianos",
    "type": "species",
    "arrow": "right",
    "image": "../assets/art/seti/cards/species_exertianos.webp",
    "actions": [
      {
        "num": 1,
        "type": "species_effect",
        "titlePt": "Carta Exertiana Secreta",
        "titleEn": "Secret Exertian Card",
        "descPt": "Conte o número de cartas de rival jogadas e vestígios do rival no tabuleiro desta espécie. Se o total for menor que 5, o rival joga secretamente uma carta.",
        "descEn": "Count rival played cards and traces on this species board. If total < 5, play a secret card."
      },
      {
        "num": 2,
        "type": "telescope",
        "titlePt": "Telescópio (Varredura)",
        "titleEn": "Telescope (Scan)",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  },
  "species_amoeba": {
    "id": "species_amoeba",
    "type": "species",
    "arrow": "right",
    "image": "../assets/art/seti/cards/species_amoeba.webp",
    "actions": [
      {
        "num": 1,
        "type": "species_effect",
        "titlePt": "Bônus de Organela Ameba",
        "titleEn": "Amoeba Organelle Bonus",
        "descPt": "Se uma das seções no tabuleiro da Ameba tiver 3 fichas de organela, o rival ganha todos os bônus de organela dessa seção (e move as fichas normalmente).",
        "descEn": "If one section on Amoeba board has 3 organelles, rival gains all bonuses and moves them."
      },
      {
        "num": 2,
        "type": "tech_free",
        "titlePt": "Tecnologia Grátis (+1 Progresso)",
        "titleEn": "Free Technology (+1 Progress)",
        "cost": 0,
        "descPt": "Adquire sua tecnologia preferida sem gastar publicidade (ou a próxima com 2 PV na trilha). +1 progresso. Nunca pula.",
        "descEn": "Take preferred technology without spending publicity (or next with 2 VP on track). +1 progress. Never skips."
      }
    ]
  },
  "species_arkhos": {
    "id": "species_arkhos",
    "type": "species",
    "arrow": "right",
    "image": "../assets/art/seti/cards/species_arkhos.webp",
    "actions": [
      {
        "num": 1,
        "type": "species_effect",
        "titlePt": "Romper Carta de Segurança Arkhos",
        "titleEn": "Break Arkhos Security Card",
        "descPt": "O rival rompe uma de suas cartas de segurança aleatoriamente e marca um espaço excedente abaixo desta espécie na cor correspondente (+3 PV). Em seguida, ganha +2 recompensas menores de exploração.",
        "descEn": "The rival breaks one of its security cards randomly and marks an excess space below this species in the corresponding color (+3 VP). Then, gains +2 minor exploration rewards."
      },
      {
        "num": 2,
        "type": "wild_life_trace",
        "titlePt": "Vestígio de Vida Selvagem",
        "titleEn": "Wild Life Trace",
        "descPt": "O rival marca um vestígio de vida selvagem na coluna de menor espaço disponível.",
        "descEn": "Rival marks a wild life trace on the lowest available column space."
      }
    ]
  },
  "species_glyphids": {
    "id": "species_glyphids",
    "type": "species",
    "arrow": "left",
    "image": "../assets/art/seti/cards/species_glyphids.webp",
    "actions": [
      {
        "num": 1,
        "type": "move_probe",
        "titlePt": "Mover Sonda para Planeta com Glifo",
        "titleEn": "Move Probe to Glyph Planet",
        "range": 4,
        "planets": ["Mercúrio", "Netuno", "Urano", "Saturno", "Júpiter", "Marte", "Vênus"],
        "preference": ["moon", "lander", "orbiter"],
        "descPt": "Verifique APENAS planetas com ficha de glifo (alcance 4): Mercúrio > Netuno > Urano > Saturno > Júpiter > Marte > Vênus. Preferência: Lua (desc tec) > Aterrissador > Orbitador.",
        "descEn": "Check ONLY planets with glyph token (range 4): Mercury > Neptune > Uranus > Saturn > Jupiter > Mars > Venus. Prefers Moon (discard tech) > Lander > Orbiter."
      },
      {
        "num": 2,
        "type": "telescope",
        "titlePt": "Telescópio (Varredura)",
        "titleEn": "Telescope (Scan)",
        "signals": 3,
        "descPt": "Marca 3 sinais (1 da Terra e 2 das cartas da fileira, usando a seta para escolher o lado). Se o rival tiver uma tecnologia de telescópio, descarte para +1 sinal extra da fileira.",
        "descEn": "Mark 3 signals (1 Earth, 2 from card row using decision arrow). Discard telescope tech for +1 extra signal from row."
      }
    ]
  }
}

target_path = "/Users/thiagocarvalho/Documents/Board games/boardbots/assets/art/seti/cards_data.json"
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(CARDS_DATA, f, indent=2, ensure_ascii=False)

print(f"cards_data.json atualizado com sucesso com {len(CARDS_DATA)} cartas!")

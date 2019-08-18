class StarParticle1 extends THREE.Object3D{

    private particleGroup: any;
    private Untitled1Emitter: any;
    public mesh: THREE.Mesh;

    private alive: number = 1;
    private flag: boolean = false;



    constructor() {

        super();


        var particleScale: number = 6;


        // Create particle group
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('img/star1.png'),
            //texture: THREE.ImageUtils.loadTexture('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAABwlSURBVHja7F0JkBzldX5vL+1qV7uSVkJC6EAIyxgECHFfDhVuY4IhGAh2iJPYcRw7OJXExiQpu5yjnKRSibENJAbHNoldnAYcZLAC2CgcFkgIYXFKAoEQIAkJdK2kPfrlvf7f3/26ZxZ1787O7s72X/Xv7Mz0Nf2+d33/+/9GIoKijd1WV9yCAgBFKwBQtLHaGsK/F8wai7+9nvsl3O/nvmtMSn/xhjFtAeZy/xr3+YULGJvtT7gfwf3PCgCMvbaQ+2f0/yu4n14AYGy1a7i36f+N3K8tADB22pmq9badz/2yAgBjo/Wn7X/Bvb0AQG2331ELUK6dwP2TBQBqt4l2/+V+thErMK0AQG22P+S+aD/bHKLpYQGAGmtCdX4x47af535oAYDaaqLVczJu28n9ywUAaqd9SLU6b7B4cgGA2mhf4T4h5z5tGjBiAYDR3U6DUtIna5ORwgsKAIzuJpRv0yD2F9KouQDA6GyXcv/oII9xyiAsSAGAYWztFYzkvww1TBHXKgCu5H78MGYRBQCGsXXC/infvE0AcHABgNHR/pT7vAof8yDuVxcAGPlt3hCaaxlLOKYAwMhuMpo3JfPWPX0A2WdGVTKwLAAwBO0kyDOez8KnuQcA1NfnOYekhGcWABiZv+NLkJXy7ekFOKAD4NpLAY6aA7CvJ8+5hBzCAgAjq0lN3yWZt+5l7T9/Ecf1hwBddCJAUwNAEGTdu1xNYQGAYWxC9X4ll98/eBrAR4Um6AI4YT7AyYexFejNc05JM9sKAIyMJqTPaZm2lICPAqBLTwHoYBcQ9IbWnC4/lcXZzO8zB4RSWfSZAgDD39rV92dr3SzwI9jnn3W0+AEFBVuE+bOBzlkIsLc7L98wqwDA8Dap9Dk8m/bLr2Vtv4y1vUm0vc/FcqHWc7/oZIDpE52LyNbmQg3UD45mAIgAspM+ot2nsK8/8YOx9ovgJZ4XMMziuOAjx7kMIXv7HPfDCgAMTxMTPDPTln0c4be3ON9f3+jeE5psjkJQ0IUMgEOmO1eRrXEgMbrJodEKgIW5gjDO8+nDCwAWzGNt73FyR9KgEJ38JQ2cOAno4hPjgDFb+wT3UwsAVLddkzkN45wfpnCseOnJTtOtYBGTRgDYTUgwePisPFagKVcgWgBg0O2sXESM+PSPHAsw+8BY+21kaAEhAWFTiwsUBRzZrcCFkIeIKgAwaO2HzNo/a6pj+8AzfWryKX4LNhyQAPFECRbnc+DYk+c+ZqeiCwAMuF2hFiAzAOjikwAmT1TSJyV0/w95H4AuQGxoYCtwGkDruDzkkAxGXVkAYGiucTb3cyEP5Stp34fYl58tQ/gmtydKRf+lb0NXcdQhAL+xIC85JANF52iK2jAaADCSLhI1sGN1BUnWj9EuizhxbgYHgFvNIxvp01AP9Nsc+LW2svz3uaNb2YfbocsG7I7me0kbcdkagB27w+NlaDL9bDH3zdzf5s47w0ruz3B/ifs27jsN1MY0ANi+wgeUSBGBS/Hl4fo6uFr8fd1AMsgjqR91x6BAFXqUAVApBEn/EZdx8AygcxcC/nhpVgD4ezpDu4wZXO6vivvL3J/X/pJ2+ayrlgEg55Aqnakq6EWq2TIDt1PJlMq5IvHh4xlbl5/mSJ+gO2niEcq8IX3rQeG/Y9chvMDS5wA2vZcHBP0B/kjt/gK2c3+X+1ruT6u1eIH7O2pFekcjAGSA5ihwS7AdoYL+oJrH+iGHWzf77zNY8xce6ny5FywY8gfKgSD1Kl/1MQA6O4E+dhLg9T/jq6+Lj1UZlzdRu8QMZ3sIc39dLcMatRaruT+nLmTEAKBFzdxBasaPUYZunqZD1Z9SJRF7eyvQx09NBnyUErQHAaJxxxSbf4sPUcJz+Kc9yG785TdZjxuH+lfUKyDmauDr3ccO7uu5r1JrIZZio/auoQZAowZiotlHq68+RC9y+ogJIzlvD9O+eTNZj3pNiofltZ6s4/evlFRS4RLa2oAu4YDwH+8cznhpqvbjzQ/ZoqB4Va3EsxpwSgDaPVAAdKhw56igj1TNnqNaPTLr4YTxmzkZ4LdOdFaUghgASEm2J+X+MWEk9A16q4DOlXyYvdkSdtEr2F03N42EX4yaGUk/QYNNUsG/ppbiWXUhHiTv9gcA8T8Xqb+epWa9Y1QxGr0B0AWsHNM53uzpNike6oCPTfGS5A+RETalECGvYkyamtm1nAb4/AZnFepHJIWCai3ma/+4fr5DXcUb3Ndxv9X/X2c2OFt9zuGjQvgiGIn4pYBj5x42++yJzjvOje2TyfOJkjEAmUDfY8CPCEKKELLuQ0B1/HxXT7B7rxsskvMHo+KJK+2aXntF55QGtloLsIz7xdx/CpWfVlW5JjdctE96I1/6hBZXy9fRCnDZ6RxPt4UcQNJLpf5nMDjj4DSeLAEU6DaCkCA9Ukjh93TlGYDbd/PtY53ZtdeBbzfHaHWsS431bp7ByC0a5yg2HLRaFd2R8JlB8fMCxJf8RF3A8Gp2oNpVh84ky42dPgloFpv4g6R3uj6T/+/U2duslTGXQ8bUW7V2WyCgUXrdFk3m4EmiiDjS74QLkC4g2Mjp+hvb3Ct33MCvb2518wzIASbcT9yFAKRuWJEhWi/rJTwWfbJ4QwkApH1YQdBZFWGTanbY+1yaJZosWj2VBXvwdKBDpnEIyia+Y7wjeVrGuRtK6gJ8TX8i4KMy8WqZzyhHWGu3ZWGi0M11Sm3s3esswU7OyDZuBXyFA/FXub/Ncdd2/uzdnc51NKiVCDkFiIE3tE1cvCx89bPEp/0AABQpP4ZKDm8GFAvZapIIfDpH73MOAJrNAe0M/n/apFDbYdKE2IeHGuV76SSOMG4LoJT1Kxfxl8kEcgsBUxljaKnqYovlX7tY6G9uc0B4m183bAZ8bTNbDrYWXd3ufgiIvaUQcFTWUvRohnB3yTcMgP54gPu4f5r7LRpVDtBn648TwYvWStXt5HYnYBH4XNbqmVOdLxcgNDe6m6a+Hrv2JeS4P2OSsPRQJqjDMkRgJExzFozDAupP+EEZgEv62ZsCHFsqkoko82a443X3AImL2LPPWQqxEus3OXBIXPHODmdF5D40NLi4YnDC/2xZ4Wcggm7X6PEGyDoKl74h/KPpiDmALGQ6kD1KJ2v0FE4w2sc7LfZRdEChR6Y93Yk7TmU8NvWrjlBK4lDqs7JjPw4VyK6DKMkDUAIEyXEDREkfKXEMvxkGJpHoIyWlejU24Q2aGl1nZaCj5znNZ7DD1u0MAHYVm7aFFgLXcsy2er27VwOjoP+c+/cHwwTezJ2dMXxzQNov2n7VuUBtLe4mhDejz0XP5vdgGI3H9Gz4TjUyzujK5PJpGhctsaOwwWQ8iMZakNF+SqMjCitsQEgq+OSx3N5xmhmeE6i09MDv0GdiHx9oSkI+jd3fDA5q6+a5673pfsCVawfKOfwN9+/sb6MsR75OD5avSZr2xPOA13E8uaPL5c1i+npVn+S3B46kIX9HXVrCvhxdmmbsNoqVIBVMoBM6ovdGaKSxgDkume0oiBlfBJ8OxvtiEP/vOAON5vV8pNYK9DrdeQy3QP47wzn44wXm+u3nPr7p7nNlaPyKtzwIeOfSgQ5A/RP3f8iyYVZoycG+kRsEMuv24acBv3ufQ70EfeRy7JhtNaXZkfAost7xjVVBpjtA6mbaDCNOA8vuq/uhcRmRJSh3DjUZlBJ2wseQve54W0wcMx54whR4YVwT4D2cqf33Qzo8nVv4N0KOR+DksS1/zf36fJEyhj8IHngK4IdLdHpWnRGKahcZGx35YYw0rkQY3rKGPL2p6whvNMa5uwdBYGo/yZhq3wNnYRIamhAYlgdPJGwDCnPs0IEQJr+37KJYJANSlLhg8TIOvZe4TCC/6Zeg/WrIUXGUZzhYDiqPWOMIDn4/Fwg4ksW7HwWSQZQrzuQfpymhD6/UN5IVXCQy5eshrWjON0fxg+5LEZGDsbZFfL87ElpNNqxxkjJ2xyfwVgJNTImJFMIGg7aoKHRnlI5z1KXp8aL4YXwzwEMrAG+6zzGd+YtP7uH+x5CziCQvxOTgn1eiKMdZ6sKYAG/9BcC9j0V0aWQmQ9+MKW6ejCklU7AZqxIGRog2ZghjDEruR961oGpd6Xdpl4NhrKH0cdltsfzwQdr3+4DQujrjBqCJFeOx1QDf/R8XK+UXvjz99Pe478m740AKQuQkf6CW4LzsIHDkCN7ycyBxC+ef5PJhCpL+M/LITjconX4BxBw+ej+v+6gPt6kbApQMBpGN+cOsgSIAltIEhiYOwFybxgsl9QZG4NF+KUYBzfWKVVy5BvA7rFO79rjgOV8TaveTyvblbgMd09yuJ308H9wcsvF7jPSHV2h1DUZCxISGpEbpyJjmhP81kXe0L8b5vJeRfh9rqJri6FzGiZMN6GzEnjxPIm7xGUN0rbElQhvXeCvGPVSEF15j4d8F8N6ugQh/ubJ8Ay4VG8ygtgwnykSIFbn2ksCGMwIUc/forxkE42LzXCJUd1PRB3pq8iOBeRcQAYgS0X0UhQcxyBKf+1QxUPCl00sqzUSse3LbYvg92nTTpJMUXUPyukKzv+5NwG/eAbDlvYGUmklJmDzrcONgqMLBVjVI5YkUHbyc2xLs3Qd4A5u95S86mjil/WH0DHoDAcpoPZakdhS5A4pMbCJkI0iABKFchI8pJtEQiirs/rKDEgsGqSJkfwwR/sYtgNfdxq+bHSuYr70CbpbUq4MdKKhEWcurisR8FyPmrmsv4PVs/latCy0BlsnR/avXIqQyhE2Q0tI+jK2DVodhYEGix+yLAUXp86bIm3j/pKCtwKkf4gcDs73w+5vfBfwWa/76twGacw+1vKXCf7YSI0WVqmtapSDYnBsE7+5gENwBuGYDkGiG3jDypFCAxhxjbFJTRJFn/0oYPXBaSxYsQXJ/shodbYcJ/0/2mEFshcBnMIGmekEpeUWeY2hsdL7+27cDvPj6QGoLxe3+LvenKjVUWMnCtuU65rw1H1vYGGqE3BRc/1ZIHJESKDEbHw/soAqCjOAxwf7FkT6a4A+twMECKiZ/kGK62dO9EaAAEjPHYrralJaQGbAKUkGspL672OLdyG5vNVvwltzC3839U9wfquRYcaUrGx9WhO7JDYINmwBuvJMN3FbAxibVGkeVOqYuZgZ9YIeU8s1BOarXuIPABIKa30OQpKFJj0XWGpCPRQxn4fc1LoLsew0SwwC2viFchxD/g93dihcGEvDJvIA/0mF6GMkA8KSE8AR7c+0l5nDtGwA33AHEUTGKuaQ4m6eENqIZ1cPYEoAxv57EATJxQrwsDPYTvFkrgqnAM0rpovSRYrCQsSCeqQyp73qgnj7AH9zLSfOzjhrPz+9/AVyBDowGAEi7VS+a8oIAn18HeNNdbgRR5ukHSXPq/WyUgoUWQVPCwI7Muc/Rm2qT+qFh/dCmmxFvz699SaB46xBbDMtbkEkrzWilFIMI8H7EOvHI0w7k+WRPOqZ/8xDJaUjXB/geuOXb84GgpRlg5UtAN/8kLJnC+sY47y8ZhCEzCGS0L9JqTEb+Noc3AiOzTRRbGG4II4BQzOunyCJMp5EopBf3ux4E+PljLuDNr/lf5f5vQyijIZ8dLBcvdYVfzwcCTgmXOXNJn7qY3QGbUS2e8AGim/OJprijtIrXl5SgoZND7U5MA4gHcOyckOjYGFckkQ1KIR6/iI+nwasMeMr4x32/BOQeRv8DG9P/+yGWT1VWCPlb7v+aey/Jj5euYM+3WP07RmY/EkW60ML4YAjMULIGjmktT9cZYGLQR7MIH+B5Px9Ash4AbPGHBooNjYBLHge8c0lcKJqvybD7tVWQTdUWiJAFlKS07LOZ9xCNkZjg4WWhRaCLz3Z4NQM7PodPDMUmagYw1uwEo1em4FM13ZaCuWqx2M/bwpG4FhDigSKxOlIq/ktO02+7X+cC5Nax/wI37F6VKUfVmuAWDCiSRa2Ve2o1wLYdrEz1Lq2S3mcIH5/fB95fm0ocU0qG9vsU1y/Hs+wiptlIQk3/DBtJSSYyDBRlnOPxlW6dgvzC5+g3/5j+aAAA6I+S1T3vzh0HT2zneKA5MulENmMz7KDP1w0b5/N5MiOMvmC0ZF5gtDyMDSYhVRpmz1VmsEj2nzJ5ID6fo8XwwVRVXS6m2lNc5cddlYvNkpLotlZABgDKDGAzchfl5IY08oUgZOlfgGjELqaJ7YgemBQyzu0xQfMmaWlPDaMFlyerJnfkWWRS2qPghte3V1kew7JM3C79sauzWQC+kRNaXQ4djcerJFMcAaXrB2z6FzF4xuknBpPM8DJAPOvXjEH4MpCSlC+R/vEtnTwpz/1Yp/dj0zDIYthWCZMVLGR++oL9bikc+sSOeGAI7OJecYIWr++BES8QTRWMksHkjGAf1PlaPQRTng4Y1fz7uj/DS5qgMjlmEQJlYkeeGE6G1DcMkxyGdaHIQzNpv9QOdLQrMwexkMiE9WSCM0iSQYlx+agKCMvUAVCk6enahIhLsGkkQJkaBXVB41tcz7Z2gKyzNHWsAUCWjcu2CIXQwfJ8n3AaGSR8MCn962OAUEB9lBrsAaWJyQSRFGUP6UqfqJjUZg0+DggoopWjmMML3QNDJr40jQvXFYrrHd+3ifAnjTUAyHTklqwWADkLIA4A0cy4ATtTyNbtWc2MCCRI+ntf35cazQMbzEEcSFKCVPKAo2Slkuf/JWhtbgkD14yPouuEakzFH2ExwMxMAJAmNOqEDh30seVe2M/Kr/E8AdJikKh6OJFdUlSajpY68vP+3AS/OBYwaR3570x8AWamE0nGkh0AMJwuYLgAICuQ7L/4PVz3b4IrozJDwVQy4VeDuKhAQ301+gAOE4vAoR8BSC8UEJh4AePiEcswYvLE8ciA35BdAEqhawiAzIHgnLEGgGyPWxPbKxE1p1YRKZOaxp8QAmByPQGKyNv3WWcAocz64SXnwJK94vpTskGm0sfY3p5natfssQaAbItLijmdODEEAPb1JeZo2DABIV4VDi2NrAtC2RQPU9PEMZqOHi8cinZKGlJqIpgRNlLCIkTLDUsg2N7hLFd04MIC2HPOyAoAlAxAxtY1+rMDO5HW+1o8S/Ik0j/zJjBz/jRATC0rYXnfkgXF7YqiSJi4pui6xPTLdQuHkS0OmDuWADAhswUIVJOiUcC0qU0xcxEpZCaIBiZK8H8Cp6poS84MCZQw+pj8nDA1WSBlkcLNZXkbcQFiAfbty2IB5H5Iffi+sZAGtmcCgAhHgil54IOmf/HAjs3VMUkKBbE5psBYBopLutAHkw1NTksNlUspcoiC1DBygImy8qjI1M9F0HEGalcLkK2Nh2Famm/kAkBMZ8SoBXGRB2BUu1cySyeIM4B4GDg171Ba07hwsSZY9yrQ9p3hNC0UDj/waaBdVRRLQUYGeAZw8axgcrN/2lqzDgo1Q9aHYNaAC5iS1f/DeFaM5lY3lzBwAZnl3sms5JQs/4rLuaKgza/Pt2cPwLMrAJevAFizFuBAxuKxi4COWcRm2y1Lh729JbEGJtyOKUGhZGQajz8woDo4gH17U1YAzBorAMgW8IjWt7D2NzeHNLBP69AIP/L16dUj5DsvKNHsRtbG7e8BvPA8wJNPAmzc6BarEi196y2A+xYD/moZwKJFAEcvBJo6xQVyfb1x6mnmG5Y+csLMQvbTRDgFRMlgspNBY8YCHJzHAlDLeEA21+iXblOiJzLV2A8nUK+FmDu2Azz9NMCqVYAieL8Yo/fPfv7Btm0ADzwQAgSPPBLguOMBDpjmANTbnVw7GMAwD/adYYQkc2nPVRcwY6wAIFvOK8Jrm6ApYE9k1kuWgTYaGfpxqcWvbwDczKb32Wec8Le+E69X1N+5PCh27ABYutTtt4CBsEieOjqHjyksX68rGEmkiggpPlE/VheQHQAHFhYgEZ66G4h9QXIIFu2qQUYLG2T+QAC4aRPgiqcAVq8GeHdr+HnoArJWaHkgyNq/TzzOIFoF8IH5gCecxF56Tug2qKcnop0T5JRPRf1q5K1t7vzZyKDpmg101TIA5C5My2T+BQDtE6OS7kjPyNC+fjlVeff6ehb8coDnWPBdu93+4wbx2KJwf05Du9n8r2JL8vxzQAKERccDzj+MQTXO5fvUV7q6aTgtndyooGQxAqZsAGivdQDMgKwLUIsAJrTrEKsh39GZbGKtRiFZXl0DsJwDuLX8uqfL+fSmCj7SRa5Dj4cMAljD55k9G+jYExwQxnOW0qNrHVlFDxQAHMNAV1eWCuEZCoC3axkA4udas9kK9aGBH5plSyCRdV1DeMPx12yaV7LGr3059M2hJWga4mf5NGld4ivrALnDTM7cjjkO4IijXLwimQX3MEcJ6wLGu0wmWxzQqgCAWgdAWyYXIDduXEu8UHIDa/zunayBLzmN37jBaV6lNT5LcNqo07vlGja+AbDsCQeEwxcAdHIKKQ+wkgEh0f6W8XlSQeECltcyALLVAYg5lRSqqTkUPOzkVO6pX4UETnjTxQ8IsdM0zE/v8gHeFs447v+pu8YFRwMsXMRAmOoALIFg9ikCB48FC5CBBOKbOmkKEAsel3FQt5Kj+q1bHDAaR8Qj25IWQdyP9Pc463jkQb7eJxkIC4GOOxlwYme4RkABgNgCZEvF3toA+KP/ZO3aHJM3WNHLFbssD16UgszKoEpWAhFZS9D32COAq1dpKpj5uqs+LFzNwaCmzACQiFnIm23vODNf31DJZ/aK4GV1zU+Ae0CmLLT4IJQ+A2TwKeTuXQCb3sqz56xaBkC+Ic+QkKmoxsuSNUvAPQ/pLHCrmEjOLYssX6Cf3QsZH7ma+Tc05PoNHVDJ5zSNagBUrolAbwO3rrE8GPN+KF2/SLb5BfePcT+d+w/BrcpV7dYGVR4TqCYAJMedXMXzyXPyOIgAeZiwLKz4SMb9OIILl8OXhzTLQg2bqwyAA2sVANUqfOTAAf6Z+8ngpls/M4BjCHMja/F+QQH0d+BW6Bzq1lJtK1lLAJClar8G7vH213B/sULHXQ9usSZ/3JeG+HdMr1UADFWO+5LRVFmP6M0hOs8WtSynglvoYtWwpsoFACJfvUh99ZYq/Q5ZCvdmBZwsjSuLO/QVANh/q0TJU5+J1n+T+w+gysOnpu3TVFLSxws1xeyu0H1qrTUASHAzcZA5vKwtdD73MzVf3w0jo+3T1FJSTFnK7HbIu0xuss3QlLkqrVpU8AEDBMAOFbY8AXNFhU3tULSl3P9PA0aJSy6B/HP/qwqAalkAqQLqyLG95PDf0oDrKvX3I134NoWU1PPTmor+S04uoQmyVE2NMgCIBchS7CBjvd/QwO6LkHUhqZHbJEP5kv6er0L2p6rMqUUL8H5tnd6oU7j/FVTgWTgjrMmDnYRMEnbx6gxcwtxaA8Cs9zGVn+N+rJrKN6C2m6SQ31aLIM9UeKrKnMmwAWBmSvBPaA4tPv7fYRgWSBzmJqnr97mfwf1iTW2DWnUBUkDnl4STdOkiFfxtw5jDjyQg3KOcxnma8UirGh1cjTRQ5r3LE0a/rilSLxStXPtfcEvonq5cRyfkfQDXABoSUXHrx3CrK25BAYCiFQAoWgGAoo3J9v8CDAA6Y8OGMhaiUgAAAABJRU5ErkJggg=='),
            maxAge: 1,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.NormalBlending
        });

        // Create particle emitter 0
        this.Untitled1Emitter = new SPE.Emitter({
            type: 'cube',
            alive: this.alive,
            particleCount: 10,
            acceleration: new THREE.Vector3(0, -40, 0),
            velocity: new THREE.Vector3(0, 20, 0),
            velocitySpread: new THREE.Vector3(30, 0, 30),
            sizeStart: .1 * particleScale,
            sizeMiddle: 1.5 * particleScale,
            sizeEnd: .1 * particleScale,
            opacityEnd: 0
        });


        this.particleGroup.addEmitter(this.Untitled1Emitter);


        // Add mesh to your scene. Adjust as necessary.
        this.add(this.particleGroup.mesh);
        this.mesh = this.particleGroup.mesh;

        //this.animate();
        Vars.setAnimateFunc(this.animate.bind(this));
    }


    private animate(): void {

        //requestAnimationFrame(() => this.animate());

        if (!this.visible) return;

        //set particle count
        this.setAlive();
        


        this.particleGroup.tick(Vars.delta);

    }


    private time: number = 0;
    private interval: number = .1;
    private setAlive(): void {

        if (!this.flag && this.alive == 0 ||
            this.flag && this.alive == 1 ) return;

        this.time += Vars.delta;
        if (this.time > this.interval) {
            if (this.flag) {
                this.alive = 1;
            } else {

                this.alive -= .2;
                if (this.alive < 0) {
                    this.alive = 0;
                    setTimeout(function () {
                        this.visible = false
                    }.bind(this), 2000);
                    return;
                }

            }

            this.Untitled1Emitter.alive = this.alive;

            this.time = 0;
        }

    }


    public on(): void {

        this.visible = true;
        this.flag = true;

    }


    public off(): void {

        this.flag = false;

    }

}
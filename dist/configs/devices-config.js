"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devicesConfig = void 0;
const read = {
    role: 'ReadCurData',
    name: 'Read buffer',
    req: ['addr', 102, 'crcb1', 'crcb2', 13, 10],
    resp: {
        type: 'buffer',
        length: 76,
        addrOffset: 0,
        crcOffset: 72,
        in: [
            {
                source: 'ic01',
                byte: 2,
                type: 'UInt32'
            },
            {
                source: 'ia01',
                byte: 4,
                type: 'UInt16'
            },
            {
                source: 'is01',
                byte: 5,
                type: 'Bool'
            },
            {
                source: 'ic02',
                byte: 6,
                type: 'UInt32'
            },
            {
                source: 'ia02',
                byte: 8,
                type: 'UInt16'
            },
            {
                source: 'is02',
                byte: 9,
                type: 'Bool'
            },
            {
                source: 'ic03',
                byte: 10,
                type: 'UInt32'
            },
            {
                source: 'ia03',
                byte: 12,
                type: 'UInt16'
            },
            {
                source: 'is03',
                byte: 13,
                type: 'Bool'
            },
            {
                source: 'ic04',
                byte: 14,
                type: 'UInt32'
            },
            {
                source: 'ia04',
                byte: 16,
                type: 'UInt16'
            },
            {
                source: 'is04',
                byte: 17,
                type: 'Bool'
            },
            {
                source: 'ic05',
                byte: 18,
                type: 'UInt32'
            },
            {
                source: 'ia05',
                byte: 20,
                type: 'UInt16'
            },
            {
                source: 'is05',
                byte: 21,
                type: 'Bool'
            },
            {
                source: 'ic06',
                byte: 22,
                type: 'UInt32'
            },
            {
                source: 'ia06',
                byte: 24,
                type: 'UInt16'
            },
            {
                source: 'is06',
                byte: 25,
                type: 'Bool'
            },
            {
                source: 'ic07',
                byte: 26,
                type: 'UInt32'
            },
            {
                source: 'ia07',
                byte: 28,
                type: 'UInt16'
            },
            {
                source: 'is07',
                byte: 29,
                type: 'Bool'
            },
            {
                source: 'ic08',
                byte: 30,
                type: 'UInt32'
            },
            {
                source: 'ia08',
                byte: 32,
                type: 'UInt16'
            },
            {
                source: 'is08',
                byte: 33,
                type: 'Bool'
            },
            {
                source: 'ic09',
                byte: 34,
                type: 'UInt32'
            },
            {
                source: 'ia09',
                byte: 36,
                type: 'UInt16'
            },
            {
                source: 'is09',
                byte: 37,
                type: 'Bool'
            },
            {
                source: 'ic10',
                byte: 38,
                type: 'UInt32'
            },
            {
                source: 'ia10',
                byte: 40,
                type: 'UInt16'
            },
            {
                source: 'is10',
                byte: 41,
                type: 'Bool'
            },
            {
                source: 'ic11',
                byte: 42,
                type: 'UInt32'
            },
            {
                source: 'ia11',
                byte: 44,
                type: 'UInt16'
            },
            {
                source: 'is11',
                byte: 45,
                type: 'Bool'
            },
            {
                source: 'ic12',
                byte: 46,
                type: 'UInt32'
            },
            {
                source: 'ia12',
                byte: 48,
                type: 'UInt16'
            },
            {
                source: 'is12',
                byte: 49,
                type: 'Bool'
            },
            {
                source: 'ic13',
                byte: 50,
                type: 'UInt32'
            },
            {
                source: 'ia13',
                byte: 52,
                type: 'UInt16'
            },
            {
                source: 'is13',
                byte: 53,
                type: 'Bool'
            },
            {
                source: 'ic14',
                byte: 54,
                type: 'UInt32'
            },
            {
                source: 'ia14',
                byte: 56,
                type: 'UInt16'
            },
            {
                source: 'is14',
                byte: 57,
                type: 'Bool'
            },
            {
                source: 'ic15',
                byte: 58,
                type: 'UInt32'
            },
            {
                source: 'ia15',
                byte: 60,
                type: 'UInt16'
            },
            {
                source: 'is15',
                byte: 61,
                type: 'Bool'
            },
            {
                source: 'ic16',
                byte: 62,
                type: 'UInt32'
            },
            {
                source: 'ia16',
                byte: 64,
                type: 'UInt16'
            },
            {
                source: 'is16',
                byte: 65,
                type: 'Bool'
            },
            {
                source: 'is17',
                byte: 66,
                type: 'Bool'
            },
            {
                source: 'is18',
                byte: 67,
                type: 'Bool'
            },
            {
                source: 'is19',
                byte: 68,
                type: 'Bool'
            },
            {
                source: 'is20',
                byte: 69,
                type: 'Bool'
            }
        ]
    }
};
const readConfig = {
    role: 'ReadConfig',
    name: 'Read config',
    req: ['addr', 102, 'crcb1', 'crcb2', 13, 10],
    in: [
        {
            source: 'i01',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i02',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i03',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i04',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i05',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i06',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i07',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i08',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i09',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i10',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i11',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i12',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i13',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i14',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i15',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i16',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i17',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i18',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i19',
            byte: 6,
            type: 'Byte'
        },
        {
            source: 'i20',
            byte: 6,
            type: 'Byte'
        }
    ]
};
const write = {
    role: 'WriteRegister',
    name: 'Write register',
    req: ['addr', 109, 'arg1b2', 'arg1b1', 'arg2', 'crcb1', 'crcb2', 13, 10],
    resp: [
        {
            type: 'msg',
            pattern: ['addr', 109, '*', '*', '*', '*', '*', 13, 10],
            text: 'Success',
            result: true
        }
    ]
};
exports.devicesConfig = [
    {
        type: 'KSD',
        commands: [
            read,
            readConfig,
            write
        ]
    }
];
//# sourceMappingURL=devices-config.js.map
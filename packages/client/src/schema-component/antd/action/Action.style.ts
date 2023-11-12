import { genStyleHook } from '../__builtins__';

const useStyles = genStyleHook('nb-action', (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      position: 'relative',
      '&:hover': { '> .general-schema-designer': { display: 'block' } },
      '&.nb-action-link': {
        '> .general-schema-designer': {
          top: '-10px',
          bottom: '-10px',
          left: '-10px',
          right: '-10px',
        },
      },
      '> .general-schema-designer': {
        position: 'absolute',
        zIndex: 999,
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        display: 'none',
        background: 'var(--colorBgSettingsHover)',
        border: '0',
        pointerEvents: 'none',
        '> .general-schema-designer-icons': {
          position: 'absolute',
          right: '2px',
          top: '2px',
          lineHeight: '16px',
          pointerEvents: 'all',
          '.ant-space-item': {
            backgroundColor: token.colorSettings,
            color: '#fff',
            lineHeight: '16px',
            width: '16px',
            paddingLeft: '1px',
            alignSelf: 'stretch',
          },
        },
      },
    },
  };
});

export default useStyles;

import { getServerSideProps } from '@/src/pages/catalago/[nome]';

describe('Catalago getServerSideProps', () => {
  it('returns nome from params', async () => {
    const context = {
      params: { nome: 'netflix' },
      req: {} as any,
      res: {} as any,
      query: {},
      resolvedUrl: '',
    };

    const result = await getServerSideProps(context as any);
    const props = 'props' in result ? result.props : null;

    expect(props).not.toBeNull();
    expect(props!.nome).toBe('netflix');
  });

  it('handles platform name with hyphens', async () => {
    const context = {
      params: { nome: 'amazon-prime-video' },
      req: {} as any,
      res: {} as any,
      query: {},
      resolvedUrl: '',
    };

    const result = await getServerSideProps(context as any);
    const props = 'props' in result ? result.props : null;

    expect(props!.nome).toBe('amazon-prime-video');
  });
});

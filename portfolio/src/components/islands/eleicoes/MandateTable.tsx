import type { MandateRow } from '../../../data/eleicoes';

interface Props {
  rows: MandateRow[];
  locale: 'en' | 'pt';
  labels: {
    indicator: string;
    lula1: string;
    lula3: string;
    bolsonaro: string;
    renan: string;
    contextLabel: string;
    lulaColor: string;
    flavioColor: string;
    renanColor: string;
  };
}

export default function MandateTable({ rows, locale, labels }: Props) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table" style={{ minWidth: 640 }}>
        <thead>
          <tr>
            <th style={{ width: 180 }}>{labels.indicator}</th>
            <th><span style={{ color: labels.lulaColor }}>{labels.lula1}</span></th>
            <th><span style={{ color: labels.lulaColor }}>{labels.lula3}</span></th>
            <th><span style={{ color: labels.flavioColor }}>{labels.bolsonaro}</span></th>
            <th><span style={{ color: labels.renanColor }}>{labels.renan}</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isContext = row.isContext;
            return (
              <tr key={i} className={isContext ? 'row-context' : ''}>
                <td className={isContext ? 'td-context td-label' : 'td-label'}>
                  {row.indicator[locale]}
                </td>
                <td className={isContext ? 'td-context' : ''}>{row.lula1[locale]}</td>
                <td className={isContext ? 'td-context' : ''}>{row.lula3[locale]}</td>
                <td className={isContext ? 'td-context' : ''}>{row.bolsonaro[locale]}</td>
                <td className={`${isContext ? 'td-context ' : ''}td-na`}>{row.renan[locale]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import React from 'react';
import DocHeader from './DocHeader';
import DocStamps from './DocStamps';

const LiveDocPrintView = ({ docMeta, htmlContent, theme, t, i18n, id }) => {
  return (
    <div className="hidden print:block print-view print:bg-white print:text-black print:min-h-screen print:w-full font-serif overflow-visible">
      {/* 
        This is the "Secret Sauce" to repeating headers on every page:
        A table where the thead stays as a page header.
      */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <td className="p-0 border-none">
              <div className="w-full pt-12 pb-8 px-12">
                <DocHeader
                  docMeta={docMeta}
                  theme="light"
                  t={t}
                  i18n={i18n}
                  id={id}
                  isPrintView={true}
                />
              </div>
            </td>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="p-0 border-none">
              <div
                className="ProseMirror print-content px-12 pb-12 overflow-visible"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                style={{
                  color: 'black',
                  background: 'white',
                  minHeight: 'auto',
                  textAlign: i18n.dir() === 'rtl' ? 'right' : 'left',
                  overflow: 'visible'
                }}
              />
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td className="p-0 border-none">
              <div className="w-full py-12 px-12">
                <DocStamps docMeta={docMeta} id={id} theme="light" t={t} i18n={i18n} />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>

      <style>{`
        @media print {
            @page {
                size: portrait;
                margin: 0 !important;
            }

            body, html { 
                margin: 0 !important; 
                padding: 0 !important;
                background: white !important;
                height: auto !important;
                overflow: visible !important;
            }

            .print-view {
                display: table !important; /* Force table layout for the whole view */
                width: 100% !important;
            }

            thead {
                display: table-header-group !important; /* Triple-forced repetition */
            }

            tfoot {
                display: table-footer-group !important;
            }

            .print-content {
                display: block !important;
                overflow: visible !important;
            }

            /* Prevent elements from being cut in half */
            .print-content p, .print-content blockquote, .print-content li, .print-content tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }

            /* Better page break handling for headers */
            .print-content h1, .print-content h2, .print-content h3 {
                page-break-after: avoid !important;
                break-after: avoid !important;
            }

            .print-content h1 { border-bottom: 2px solid #3b82f6 !important; font-size: 2.4em; margin: 0.8em 0; line-height: 1.1; }
            .print-content h2 { border-left: 4px solid #3b82f6 !important; padding-left: 15px !important; color: #3b82f6 !important; font-size: 1.8em; margin: 1em 0; }
            .print-content h3 { font-size: 1.4em; border-bottom: 1px solid #eee !important; padding-bottom: 5px !important; }
            .print-content h4 { font-size: 1.25em; text-transform: uppercase !important; letter-spacing: 0.05em !important; color: #3b82f6 !important; }
            
            .print-content table { border: 1px solid #ddd !important; width: 100% !important; border-collapse: collapse !important; margin: 2em 0 !important; }
            .print-content td, .print-content th { border: 1px solid #ddd !important; padding: 12px !important; font-size: 11pt !important; }
            .print-content th { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; }

            .print-content blockquote { border-left: 5px solid #3b82f6 !important; background: #f9f9f9 !important; padding: 15px !important; font-style: italic !important; -webkit-print-color-adjust: exact; }
            
            .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default LiveDocPrintView;
